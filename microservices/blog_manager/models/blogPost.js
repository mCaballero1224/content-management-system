const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	tags: [String],
	createdAt: { type: Date, default: Date.now },
	contentPath: { type: String, required: true }
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = BlogPost;

