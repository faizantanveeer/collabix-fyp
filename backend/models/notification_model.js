const mongoose = require("mongoose");

// Define the schema for notifications
const notificationSchema = new mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Influencer
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Business
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  read: { type: Boolean, default: false },
  },
  { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema); // Export the Notification model
