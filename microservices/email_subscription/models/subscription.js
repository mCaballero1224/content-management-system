const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	subscriptionDate: { type: Date, default: Date.now },
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
