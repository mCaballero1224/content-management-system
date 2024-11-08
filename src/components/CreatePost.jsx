import React, { useState } from "react";
import axios from "axios";

function CreatePost({ onPostCreated }) {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [tags, setTags] = useState("");
	const [content, setContent] = useState("");
	const [message, setMessage] = useState("");

	// CRUD service URL from environment variables
	const crudServiceUrl = "/api/crud";

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Convert the content to a Markdown file
		const blob = new Blob([content], { type: "text/markdown" });
		const file = new File([blob], "content.md", { type: "text/markdown" });

		const formData = new FormData();
		formData.append("title", title);
		formData.append("author", author);
		formData.append("tags", tags);
		formData.append("content", file);

		try {
			const response = await axios.post(`${crudServiceUrl}/posts`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setMessage("Blog post created successfully!");
			onPostCreated(response.data.post);
			setTitle("");
			setAuthor("");
			setTags("");
			setContent("");
		} catch (error) {
			console.error("Error creating post:", error);
			setMessage("Failed to create blog post.");
		}
	};

	return (
		<div className="component">
			<h2>Create New Post</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="Author"
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="Tags (comma-separated)"
					value={tags}
					onChange={(e) => setTags(e.target.value)}
				/>
				<textarea
					placeholder="Write your Markdown content here..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows="10"
					required
				></textarea>
				<button type="submit">Create Post</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}

export default CreatePost;

