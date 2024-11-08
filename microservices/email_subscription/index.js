const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Subscription = require("./models/subscription");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const app = express();
const port = process.env.PORT

app.use(express.json());

const createTransporter = async () => {
	const oauth2Client = new OAuth2(
		process.env.NODEMAILER_CLIENT_ID,
		process.env.NODEMAILER_CLIENT_SECRET,
		"https://developers.google.com/oauthplayground"
	);
	oauth2Client.setCredentials({
		refresh_token: process.env.NODEMAILER_REFRESH_TOKEN
	});
	const accessToken = await new Promise((resolve, resjet) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				reject("Failed to create access token :");
			}
			resolve(token);
		});
	});
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: process.env.NODEMAILER_EMAIL,
			accessToken,
			clientId: process.env.NODEMAILER_CLIENT_ID,
			clientSecret: process.env.NODEMAILER_CLIENT_SECRET,
			refreshToken: process.env.NODEMAILER_REFRESH_TOKEN
		}
	});
	return transporter;
};

const sendEmail = async (emailOptions) => {
	let emailTransporter = await createTransporter();
	await emailTransporter.sendMail(emailOptions);
};

mongoose.connect(process.env.MONGODB_CONNECTION_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log("MongoDB connection error:", err));

/* Route to check for service */
app.get("/", (req, res) => {
	console.log("GET request to email subscription service made.");
	res.json({ message: "Welcome to the Email Subscription Service!" });
});

/* Route to create new subscription */
app.post("/subscribe", async (req, res) => {
	const { name, email } = req.body;
	try {
		const newSubscription = new Subscription({ name, email });
		await newSubscription.save();
		const emailOptions = {
			from: process.env.NODEMAILER_EMAIL,
			to: email,
			subject: "Subscription Confirmation",
			text: `Hello ${name},\nThank you for subscribing to my blog! You will receive regular updates on content going forward.`
		};
		sendEmail(emailOptions);
		res.status(201).json({ message: "Subscription created and confirmation email sent." });
	} catch (error) {
		console.error("Error creating subscription:", error);
		if (error.code === 11000) {
			res.status(400).json({ message: "Email already subscribed." });
		} else {
			res.status(500).json({ message: "Failed to create subscription." });
		}
	}
});

/* Route to get all subscriptions */
app.get("/subscribers", async (req, res) => {
	try {
		const subscribers = await Subscription.find();
		res.json(subscribers);
	} catch (error) {
		console.error("Error fetching subscribers:", error);
		res.status(500).json({ message: "Failed to fetch subscribers." });
	}
});

app.listen(port, () => {
	console.log(`Email Subscription service listening on port ${port}`);
});
