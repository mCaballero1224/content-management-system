import { ThumbUp, ThumbDown, Visibility } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { marked } from "marked";

function BlogPostView() {
	const { postId } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [previousPost, setPreviousPost] = useState(null);
	const [nextPost, setNextPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [newComment, setNewComment] = useState({ author: "", comment: "" });
	const [viewsIncremented, setViewsIncremented] = useState(false); // New state to track if views are updated

	const analyticsServiceUrl = '/api/analytics';
	const crudServiceUrl = '/api/crud';

	// Fetch navigation links
	useEffect(() => {
		const fetchNavigationLinks = async () => {
			try {
				const prevResponse = await axios.get(`${crudServiceUrl}/posts/${postId}/previous`);
				setPreviousPost(prevResponse.data);
			} catch {
				setPreviousPost(null);
			}
			try {
				const nextResponse = await axios.get(`${crudServiceUrl}/posts/${postId}/next`);
				setNextPost(nextResponse.data);
			} catch {
				setNextPost(null);
			}
		};
		fetchNavigationLinks();
	}, [postId]);

	// Fetch post and increment views
	useEffect(() => {
		const fetchPostAndIncrementViews = async () => {
			try {
				// Fetch the blog post
				const postResponse = await axios.get(`${crudServiceUrl}/posts/${postId}`);
				setPost(postResponse.data);

				// Increment views only if not already incremented
				if (!viewsIncremented) {
					await axios.post(`${analyticsServiceUrl}/views/${postId}`);
					setViewsIncremented(true); // Set the flag to prevent multiple increments
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching post or updating views:", error.message);
				setError("Failed to load post");
				setLoading(false);
			}
		};
		fetchPostAndIncrementViews();
	}, [postId, viewsIncremented]);

	const handleComment = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${analyticsServiceUrl}/comments/${postId}`,
				newComment
			);
			setPost(response.data);
			setNewComment({ author: "", comment: "" });
		} catch (error) {
			console.error("Error adding comment:", error);
		}
	};

	const handleLike = async () => {
		try {
			const response = await axios.post(`${analyticsServiceUrl}/likes/${postId}`);
			setPost(response.data);
		} catch (error) {
			console.error("Error updating likes:", error.message);
		}
	};

	const handleDislike = async () => {
		try {
			const response = await axios.post(`${analyticsServiceUrl}/dislikes/${postId}`);
			setPost(response.data);
		} catch (error) {
			console.error("Error updating likes:", error.message);
		}
	};

	const navigatePrevious = () => {
		navigate(`/post/${previousPost._id}`);
	};

	const navigateNext = () => {
		navigate(`/post/${nextPost._id}`);
	};

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
			<div className="stats">
				<p><ThumbUp color="primary" onClick={handleLike}/>{post.likes}</p>
				<p><ThumbDown sx={{ color: pink[500] }} onClick={handleDislike}/>{post.dislikes}</p>
				<p><Visibility />{post.views}</p>
			</div>
			<div className="comment-section">
				<h3 className="comment-header">Comments</h3>
				{post.comments.length === 0 ? (
					<p>No comments yet. Be the first to comment!</p>
				) : (
					post.comments.map((comment, index) => (
						<div key={index} className="comment">
							<hr />
							<p>@<strong>{comment.author}</strong></p>
							<p>{comment.comment}</p>
						</div>
					))
				)}
			</div>
			<div className="comment-form">
				<h3 className="comment-header">Post a comment!</h3>
				<form onSubmit={handleComment}>
					<input
						type="text"
						name="author"
						placeholder="Your Name"
						value={newComment.author}
						onChange={(e) =>
							setNewComment({
								...newComment,
								author: e.target.value
							})
						}
					/>
					<textarea
						name="comment"
						placeholder="Your Comment"
						value={newComment.comment}
						onChange={(e) =>
							setNewComment({
								...newComment,
								comment: e.target.value
							})
						}
						rows="4"
					></textarea>
					<button type="submit">Add comment</button>
				</form>
			</div>
			<div className="post-nav">
				{previousPost && (
					<button onClick={navigatePrevious}>
						Previous: {previousPost.title}
					</button>
				)}
				{nextPost && (
					<button onClick={navigateNext}>
						Next: {nextPost.title}
					</button>
				)}
			</div>
		</div>
	);
}

export default BlogPostView;
