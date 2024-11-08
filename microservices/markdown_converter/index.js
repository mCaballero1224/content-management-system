const express = require("express");
const showdown = require("showdown");

const app = express();
const port = process.env.PORT;
const converter = new showdown.Converter({
	omitExtraWLIncodeBlocks: true,
	simplifiedAutoLink: true,
	strikethrough: true
});

app.use(express.json());

app.get("/", (req, res) => {
	console.log("GET request to markdown converter service made.");
	res.json({ message: "Welcome to the Markdown Converter Service!" });
});

app.post("/convert", (req, res) => {
	const { markdown } = req.body;

	if (!markdown) {
		return res.status(400).json({ message: "Markdown content not found." });
	}
	try {
		const html = converter.makeHtml(markdown);
		res.json({ html });
	} catch (error) {
		console.error("Error converting markdown:", error);
		res.status(500).json({ message: "Failed to convert markdown." });
	}
});

app.listen(port, () => {
	console.log(`Markdown converter service listening on port ${port}`);
});
