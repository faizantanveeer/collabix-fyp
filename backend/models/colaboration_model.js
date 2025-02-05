const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collaborationSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" },
    messages: [String], // For simple chat
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Collaboration", collaborationSchema);
  