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
				const allTags = response.data.flatMap(post => post.tags);
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
				const response = await axios.get(`/api/crud/posts/tag/${tag}`);
				setFilteredPosts(response.data);
			} catch (error) {
				console.error("Error filtering posts by tag:", error);
			}
		}
	};

	return (
		<div className="component">
			<h2>All Blog Posts</h2>
			
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

			<ul className="post-list">
				{filteredPosts.map((post) => (
					<li key={post._id}>
						<Link to={`/post/${post._id}`}><h3>{post.title}</h3></Link>
						<p>by {post.author}</p>
						<p>Tags: {post.tags.join(", ")}</p>
						{/* Link to the UpdatePost route with the postId */}
						<Link to={`/posts/update/${post._id}`}>Edit Post</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default PostList;

