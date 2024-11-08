import React, { useState } from "react";
import axios from "axios";

function MarkdownPreview() {
	const [markdown, setMarkdown] = useState("");
	const [htmlContent, setHtmlContent] = useState("");

	// Converter service URL from environment variables
	const converterServiceUrl = "/api/markdown";

	const handlePreview = async () => {
		try {
			const response = await axios.post(`${converterServiceUrl}/convert`, { markdown });
			setHtmlContent(response.data.html);
		} catch (error) {
			console.error("Error converting Markdown:", error);
			setHtmlContent("Error converting Markdown.");
		}
	};

	return (
		<div className="container">
			<h2>Markdown Preview</h2>
			<textarea
				value={markdown}
				onChange={(e) => setMarkdown(e.target.value)}
				placeholder="Enter Markdown text here..."
				rows="10"
			></textarea>
			<button onClick={handlePreview}>Preview HTML</button>
			<div
				dangerouslySetInnerHTML={{ __html: htmlContent }}
				style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}
			></div>
		</div>
	);
}

export default MarkdownPreview;

