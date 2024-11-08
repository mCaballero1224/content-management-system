/**
 * @brief Microservice to perform CRUD operations on blog posts 
 * 
 * @author Michael Caballero
 * @version 0.1
*/
const express = require("express"); /* Web server */
const mongoose = require("mongoose"); /* Database connection */
const multer = require("multer"); /* Used to handle uploading of files */
const path = require("path"); /* Used for file paths */
const fs = require("fs"); /* Used to read/write from file system */
const { v4: uuidv4 } = require("uuid"); /* Used to generate filenames */

/* Blogs are saved as a hybrid of data in a mongodb for metadata, and content in a file */
const BlogPost = require("./models/blogPost"); /* Schema for Blog Posts */

const app = express();
const port = process.env.PORT;

/* Middleware to parse JSON and URL-encoded data */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Set up multer for file uploads */
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${uuidv4()}.md`);
	},
});
const upload = multer({ storage });

/* Connect to MongoDB */
mongoose.connect(process.env.MONGODB_CONNECTION_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

/* Create blog post route with automatic file generation */
app.post("/posts", upload.single("content"), async (req, res) => {
	// Get data from the request body */
	const { title, author, tags, content } = req.body;
	let contentPath;
	if (req.file) {
		// Use uploaded file if present
		contentPath = req.file.path;
	} else if (content) {
		// Create a new file with the provided content
		contentPath = `./uploads/${uuidv4()}.md`;
		fs.writeFileSync(contentPath, content);
	} else {
		return res.status(400).json({ message: "Markdown content is required." });
	}
	try {
		/* Create new blog posts from request data */
		const newPost = new BlogPost({
			title,
			author,
			// Split tags by comma
			tags: tags ? tags.split(",") : [],
			contentPath,
		});
		/* Save the blog post to the DB */
		await newPost.save();
		res.json({ message: "Blog post created successfully!", post: newPost });
	} catch (error) {
		console.error("Error creating post:", error);
		res.status(500).json({ message: "Failed to create blog post." });
	}
});

/* Get all blog posts */
app.get("/posts", async (req, res) => {
	try {
		const posts = await BlogPost.find();
		res.json(posts);
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500).json({ message: "Failed to fetch posts." });
	}
});

/* Get a blog post by ID; used for Update form and reading single posts */
app.get("/posts/:id", async (req, res) => {
	const { id } = req.params;
	console.log("Received request for post with ID:", id);
	// Check if the ID is a valid MongoDB ObjectId
	if (!mongoose.Types.ObjectId.isValid(id)) {
		console.log("Invalid post ID format:", id);
		return res.status(400).json({ message: "Invalid post ID." });
	}
	try {
		// Fetch the post from the database
		const post = await BlogPost.findById(id);
		if (!post) {
			console.log("Post not found with ID:", id);
			return res.status(404).json({ message: "Post not found." });
		}
		console.log("Found post:", post);
		// Read the markdown content from the file system
		let content = "";
		try {
			content = fs.readFileSync(post.contentPath, "utf-8");
			console.log("Successfully read content from file:", post.contentPath);
		} catch (fileError) {
			console.error("Error reading file content:", fileError);
			return res.status(500).json({ message: "Failed to read post content." });
		}
		// Respond with the post data and markdown content
		const responseData = {
			...post.toObject(),
			content,
		};
		console.log("Sending response data:", responseData);

		res.json(responseData);
	} catch (error) {
		console.error("Error fetching post from database:", error);
		res.status(500).json({ message: "Failed to fetch post." });
	}
});

/* Get blog posts by tag */
app.get("/posts/tag/:tag", async (req, res) => {
	const { tag } = req.params;
	try {
		const posts = await BlogPost.find({ tags: { $in: [tag] } });
		if (posts.length === 0) {
			return res.status(404).json({ message: `No posts found with tag: ${tag}` });
		}
		res.json(posts);
	} catch (error) {
		console.error("Error fetching posts by tag:", error);
		res.status(500).json({ message: "Failed to fetch posts by tag." });
	}
});

// Update a blog post
app.put("/posts/:id", upload.single("content"), async (req, res) => {
	const { id } = req.params;
	const { title, author, tags, content } = req.body;

	try {
		const post = await BlogPost.findById(id);
		if (!post) {
			return res.status(404).json({ message: "Post not found." });
		}

		// Update fields if provided
		if (title) post.title = title;
		if (author) post.author = author;
		if (tags) post.tags = tags.split(",");

		// Handle file update
		if (req.file) {
			// Delete old file and use the new uploaded file
			fs.unlinkSync(post.contentPath);
			post.contentPath = req.file.path;
		} else if (content) {
			// Overwrite existing content in the file
			fs.writeFileSync(post.contentPath, content);
		}

		await post.save();
		res.json({ message: "Blog post updated successfully!", post });
	} catch (error) {
		console.error("Error updating post:", error);
		res.status(500).json({ message: "Failed to update blog post." });
	}
});

// Delete a blog post
app.delete("/posts/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const post = await BlogPost.findById(id);
		if (!post) {
			return res.status(404).json({ message: "Post not found." });
		}

		// Delete the associated file
		fs.unlinkSync(post.contentPath);

		// Delete the post from the database
		await post.deleteOne();
		res.json({ message: "Blog post deleted successfully." });
	} catch (error) {
		console.error("Error deleting post:", error);
		res.status(500).json({ message: "Failed to delete blog post." });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Blog CRUD Service listening on port ${port}`);
});
