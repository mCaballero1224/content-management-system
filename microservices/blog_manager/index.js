/**
 * @brief Microservice to perform CRUD operations on blog posts 
 * 
 * @author Michael Caballero
 * @version 0.1
*/
const express = require("express"); /* Web server */
const mongoose = require("mongoose"); /* Database connection */
const blogPostRoutes = require("./routes/BlogPosts");
const app = express();
const PORT = process.env.PORT || 3003;

/* Middleware to parse JSON and URL-encoded data */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", blogPostRoutes);

/* Connect to MongoDB */
mongoose.connect(process.env.MONGODB_CONNECTION_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

/* Set the service to listen on the assigned port */
app.listen(PORT, () => {
	console.log(`Blog CRUD service running on port ${PORT}`);
});
