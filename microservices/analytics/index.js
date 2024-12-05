const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 3004 ;

/* Middleware */
app.use(bodyParser.json());
app.use("/", analyticsRoutes);

/* Connect to MongoDB */
mongoose.connect(process.env.MONGODB_CONNECTION_URI)
				.then(() => console.log("Connected to MongoDB"))
				.catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Analytics service running on port ${PORT}`));
