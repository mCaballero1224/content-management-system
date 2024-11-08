import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import UpdatePost from "./components/UpdatePost";
import MarkdownPreview from "./components/MarkdownPreview";
import BlogPostView from "./components/BlogPostView";
import Subscribe from "./components/Subscribe";

function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/create-post">Create Post</Link></li>
						<li><Link to="/preview-markdown">Preview Markdown</Link></li>
						<li><Link to="/subscribe">Subscribe</Link></li>
					</ul>
				</nav>
				<hr />

				<Routes>
					{/* Home page route */}
					<Route path="/" element={<Home />} />
					
					{/* Create Post route */}
					<Route path="/create-post" element={<CreatePost onPostCreated={() => {}} />} />
					
					{/* Post List route */}
					<Route path="/posts" element={<PostList />} />
					
					{/* Update Post route */}
					<Route path="/posts/update/:postId" element={<UpdatePost />} />
					
					{/* Preview Markdown route */}
					<Route path="/preview-markdown" element={<MarkdownPreview />} />
					
					{/* Subscribe route */}
					<Route path="/subscribe" element={<Subscribe />} />
					
					{/* Blog Post View route */}
					<Route path="/post/:postId" element={<BlogPostView />} />
				</Routes>
			</div>
		</Router>
	);
}

function Home() {
	return (
		<div>
			<h1>Welcome to the Blog Service</h1>
			<PostList />
		</div>
	);
}

export default App;

