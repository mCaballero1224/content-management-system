import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import UpdatePost from "./components/UpdatePost";
import BlogPostView from "./components/BlogPostView";
import Subscribe from "./components/Subscribe";
import Analytics from "./components/Analytics";

function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/create-post">Create Post</Link></li>
						<li><Link to="/subscribe">Subscribe</Link></li>
						<li><Link to="/analytics">Analytics</Link></li>
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
					
					{/* Subscribe route */}
					<Route path="/subscribe" element={<Subscribe />} />
					
					{/* Blog Post View route */}
					<Route path="/post/:postId" element={<BlogPostView />} />
					
					{/* Analytics route */}
					<Route path="/analytics" element={<Analytics />} />
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

