import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { marked } from "marked";

function BlogPostView() {
	const { postId } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const crudServiceUrl = '/api/crud'

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await axios.get(`${crudServiceUrl}/posts/${postId}`);
				setPost(response.data);
				setLoading(false);
			} catch (err) {
				setError("Failed to load post");
				setLoading(false);
			}
		};
		fetchPost();
	}, [postId]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;
	if (!post) return <p>No post found.</p>;

	const { title, author, createdAt, content } = post;

	return (
		<div className="component">
			<h1>{title}</h1>
			<p><strong>Author:</strong> {author}</p>
			<p><strong>Date Published:</strong> {new Date(createdAt).toLocaleDateString()}</p>
			<hr />
			<div className="post-content" dangerouslySetInnerHTML={{ __html: marked(content) }} />
		</div>
	);
}

export default BlogPostView;

