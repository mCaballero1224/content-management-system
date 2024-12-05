import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PostList() {
	const [posts, setPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [tags, setTags] = useState([]);
	const [activeTag, setActiveTag] = useState("All");

	// Fetch all posts on component load
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await axios.get("/api/crud/posts");
				setPosts(response.data);
				setFilteredPosts(response.data); // Initially show all posts
				// Extract unique tags from posts
				const allTags = response.data.flatMap((post) => post.tags);
				const uniqueTags = [...new Set(allTags)];
				setTags(uniqueTags);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};
		fetchPosts();
	}, []);

	// Filter posts by selected tag
	const filterByTag = async (tag) => {
		setActiveTag(tag); // Set the active tag for styling
		if (tag === "All") {
			setFilteredPosts(posts);
		} else {
			try {
				const response = await axios.get(`/api/crud/tag/${tag}`);
				console.log(response);
				setFilteredPosts(response.data);
			} catch (error) {
				console.error("Error filtering posts by tag:", error);
			}
		}
	};

	// Delete a post
	const deletePost = async (postId, analyticsId) => {
		try {
			await axios.delete(`/api/crud/posts/${postId}`);
			await axios.delete(`/api/analytics/${analyticsId}`);
			// Remove the deleted post from state
			const updatedPosts = posts.filter((post) => post._id !== postId);
			setPosts(updatedPosts);
			setFilteredPosts(updatedPosts);
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	return (
		<div className="component">
			{/* Filter buttons */}
			<div className="filter-buttons">
				<button
					className={`filter-button ${activeTag === "All" ? "active" : ""}`}
					onClick={() => filterByTag("All")}
				>
					All
				</button>
				{tags.map((tag) => (
					<button
						key={tag}
						className={`filter-button ${activeTag === tag ? "active" : ""}`}
						onClick={() => filterByTag(tag)}
					>
						{tag}
					</button>
				))}
			</div>

			<table className="post-list">
				<thead>
					<tr>
						{/* Create a new post */}
						<th><Link to="/create-post">New</Link></th>
						{/* Spacer for edit button */}
						<th></th>
						{/* Spacer for delete button */}
						<th></th>
						<th>Title</th>
						<th>Author</th>
						<th>Tags</th>
						<th>Created At</th>
					</tr>
				</thead>
				{filteredPosts.map((post) => (
					<tr key={post._id}>
						<td>
							<Link to={`/post/${post._id}`}>View</Link>
						</td>
						<td>Edit</td>
						<td className="faux-link" onClick={() => deletePost(post._id, post.analyticsId)}>
							Delete
						</td>
						<td>{post.title}</td>
						<td>{post.author}</td>
						<td>{post.tags.join(", ")}</td>
						<td>{post.createdAt}</td>
					</tr>
				))}
			</table>
		</div>
	);
}

export default PostList;
