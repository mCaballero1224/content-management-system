/* routes/BlogPosts.js 
 * handles the routing for the CRUD microservice
 */

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const BlogPost = require("../models/BlogPost");

/* POST /posts
	* create blog post and save to MongoDB
	*/
router.post("/posts", async (req, res) => {
	/* Get data from the request body */
	const { title, author, tags, content, analyticsId } = req.body;
	try {
		const newPost = new BlogPost({
			title,
			author,
			/* Split tags by comma */
			tags: tags ? tags.split(",") : [],
			content,
			analyticsId,
		});
		/* Save the blog post to the DB */
		await newPost.save();
		console.log("Post saved to databse!");
		res.json(newPost);
	} catch (error) {
		console.error("Error creating post:", error);
		res.status(500)
			.json({ message: "Failed to create blog post." });
	}
});

/* GET /posts
 * get all blog posts
 */
router.get("/posts", async (req, res) => {
	try {
		const posts = await BlogPost.find();
		res.json(posts);
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500)
			.json({ message: "Failed to fetch posts." });
	}
});

/* GET/posts/:id
 * Get a blog post by ID 
 */
router.get("/posts/:id", async (req, res) => {
	const { id } = req.params;
	/* Check for valid object ID */
	if (!mongoose.Types.ObjectId.isValid(id)) {
		console.log("Invalid post ID:", id);
		return res.status(400)
			.json({ message: "Invalid post ID." });
	}
	try {
		const post = await BlogPost.findById(id);
		if (!post) {
			console.log("Post not found with ID:", id);
			return res.status(404).json({ message: "Post not found." });
		}
		console.log(`Found post: id ${post._id}`);
		res.json(post);
	} catch (error) {
		console.error("Error retrieving blog post:", error.message);
	}
});

/* GET/posts/:tag
 * get blog posts by tag 
 */
router.get("/tag/:tag", async (req, res) => {
	const { tag } = req.params;
	try {
		const posts = await BlogPost.find({ tags: { $in: [tag] } });
		if (posts.legnth === 0 ) {
			return res.status(404)
				.json({ message: `No posts found with tag '${tag}'` });
		}
		res.json(posts);
	} catch (error) {
		console.error("Error fetching posts by tag:", error);
		res.status(500)
				.json({ message: "Failed to fetch posts by tag." });
	}
});

/* PUT /posts/:id
 * Update a blog post by ID
 */
router.put("/posts/:id", async (req, res) => {
	/* Get post ID from request parameters */
	const { id } = req.params;
	/* Get updated blog details from the request body */
	const { title, author, tags, content } = req.body;
	try {
		/* Get blog post to be updated by its ID */
		const post = await BlogPost.findById(id);
		/* Update fields if present */
		if (title) post.title = title;
		if (author) post.author = author;
		if (tags) post.tags = tags.split(",");
		if (content) post.content = content;
	} catch (error) {
		console.error("Error updating post:", error);
		res.status(500)
			.json({ message: "Failed to udpate blog post." });
	}
});

/* DELETE /posts/:id
 * deletes a blog post by ID
 */
router.delete("/posts/:id", async (req, res) => {
	/* Get post ID from request parameters */
	const { id } = req.params;
	try {
		/* Get the blog post */
		const post = await BlogPost.findById(id);
		if (!post) {
			return res.status(404)
				.json({ message: "Post  not found." });
		}
		/* Delete the post from the database */
		await post.deleteOne();
		console.log(`Post ${post._id} deleted!`);
		res.json({ message: "Blog post deleted successfully." });
	} catch (error) {
		console.error("Error deleting post:", error.message);
		res.status(500)
			.json({ message: "Failed to delete blog post." });
	}
});

/* GET /posts/:id/next
	* get next post from ID
	*/
router.get("/posts/:id/next", async (req, res) => {
	try {
		const { id } = req.params;
		const currentPost = await BlogPost.findById(id);
		if (!currentPost) {
			return res.status(404).json({ message: "Post not found." });
		}
		const nextPost = await BlogPost.findOne({
			createdAt: { $gt: currentPost.createdAt } 
		}).sort({ createdAt: 1 })
			.exec();
		if (!nextPost) {
			return res.status(404).json({ message: "Post not found." });
		}
		res.json(nextPost);
	} catch (error) {
		console.error("Error getting post:", error.message);
		res.status(500).json({ message: "Failed to get post." });
	}
});

/* GET /posts/:id/previous
	* get previous post from ID
	*/
router.get("/posts/:id/previous", async (req, res) => {
	try {
		const { id } = req.params;
		const currentPost = await BlogPost.findById(id);
		if (!currentPost) {
			return res.status(404).json({ message: "Post not found." });
		}
		const previousPost = await BlogPost.findOne({
			createdAt: { $lt: currentPost.createdAt } 
		}).sort({ createdAt: -1 })
			.exec();
		if (!previousPost) {
			return res.status(404).json({ message: "Post not found." });
		}
		res.json(previousPost);
	} catch (error) {
		console.error("Error getting post:", error.message);
		res.status(500).json({ message: "Failed to get post." });
	}
});

module.exports = router;
