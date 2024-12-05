const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	tags: [String],
	createdAt: { type: Date, default: Date.now },
	content: { type: String, required: true },
	views: { type: Number, default: 0 },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	comments: [
		{
			author: { type: String, required: true },
			comment: { type: String, required: true },
			createdAt: { type: Date, default: Date.now },
		}
	],
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = BlogPost;
