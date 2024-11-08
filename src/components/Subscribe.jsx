import React, { useState } from "react";
import axios from "axios";

function Subscribe() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");

	// Email service URL from environment variables
	const emailServiceUrl = "/api/email";

	const handleSubscribe = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(`${emailServiceUrl}/subscribe`, { email, name });
			setMessage("Subscription successful!");
			setEmail("");
			setName("");
		} catch (error) {
			console.error("Error subscribing:", error);
			setMessage("Failed to subscribe.");
		}
	};

	return (
		<div className="component">
			<h2>Subscribe to our Blog</h2>
			<form onSubmit={handleSubscribe}>
				<input
					type="text"
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<button type="submit">Subscribe</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}

export default Subscribe;

