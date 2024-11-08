import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UpdatePost({ onPostUpdated }) {
	const { postId } = useParams();
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [tags, setTags] = useState("");
	const [content, setContent] = useState("");
	const [message, setMessage] = useState("");

	// CRUD service URL
	const crudServiceUrl = "/api/crud";

	// Fetch post data on load
	useEffect(() => {
		const fetchPost = async () => {
			try {
				// Fetch post data from the backend
				const response = await axios.get(`${crudServiceUrl}/posts/${postId}`);
				const post = response.data;

				// Set the title, author, and tags
				setTitle(post.title);
				setAuthor(post.author);
				setTags(post.tags.join(","));

				// Set the markdown content directly from the response
				setContent(post.content); // Directly use content from backend
			} catch (error) {
				console.error("Error fetching post:", error);
			}
		};
		fetchPost();
	}, [postId]);

	// Handle post update
	const handleUpdate = async (e) => {
		e.preventDefault();

		// Prepare the markdown file for upload
		const blob = new Blob([content], { type: "text/markdown" });
		const file = new File([blob], "content.md", { type: "text/markdown" });

		const formData = new FormData();
		formData.append("title", title);
		formData.append("author", author);
		formData.append("tags", tags);
		formData.append("content", file);

		try {
			await axios.put(`${crudServiceUrl}/posts/${postId}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setMessage("Blog post updated successfully!");
			onPostUpdated();
		} catch (error) {
			console.error("Error updating post:", error);
			setMessage("Failed to update blog post.");
		}
	};

	return (
		<div className="component">
			<h2>Update Post</h2>
			<form onSubmit={handleUpdate}>
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
				<button type="submit">Update Post</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}

export default UpdatePost;
