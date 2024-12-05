import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AnalyticsList() {
	const [posts, setPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [tags, setTags] = useState([]);
	const [activeTag, setActiveTag] = useState("All");
	const [overallStats, setOverallStats] = useState({
		views: 0,
		likes: 0,
		dislikes: 0,
		comments: 0,
	});

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

	const calculateOverallStats = (posts) => {
		const stats = posts.reduce(
			(acc, post) => ({
				views: acc.views + post.views,
				likes: acc.likes + post.likes,
				dislikes: acc.dislikes + post.dislikes,
				comments: acc.comments + (
					post.comments ? post.comments.length : 0
				),
			}),
			{ views: 0, likes: 0, dislikes: 0 }
		);
		setOverallStats(stats);
	};

	// Filter posts by selected tag
	const filterByTag = async (tag) => {
		setActiveTag(tag); // Set the active tag for styling
		if (tag === "All") {
			setFilteredPosts(posts);
		} else {
			try {
				const response = await axios.get(`/api/crud//tag/${tag}`);
				setFilteredPosts(response.data);
				calculateOverallStats(response.data);
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

			<div className="overall-stats">
				<h2>Overall Statistics</h2>
				<p>Total Views: {overallStats.views}</p>
				<p>Total Likes: {overallStats.likes}</p>
				<p>Total Dislikes: {overallStats.likes}</p>
			</div>

			<table className="post-list">
				<thead>
					<tr>
						<th>ID</th>
						<th>Title</th>
						<th>Author</th>
						<th>Views</th>
						<th>Likes</th>
						<th>Dislikes</th>
						<th>Comments</th>
					</tr>
				</thead>
				{filteredPosts.map((post) => (
					<tr key={post._id}>
						<td>{post._id}</td>
						<td>{post.title}</td>
						<td>{post.author}</td>
						<td>{post.views}</td>
						<td>{post.likes}</td>
						<td>{post.dislikes}</td>
						<td>{post.comments.length}</td>
					</tr>
				))}
			</table>
		</div>
	);
}

export default AnalyticsList;
