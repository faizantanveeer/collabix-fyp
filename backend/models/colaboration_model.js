const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collaborationSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined", "completed"], default: "pending" },
    message: { type: String },
    budget: { type: Number },
    deliverables: { type: String },
  },
  { timestamps: true }
);
  
  module.exports = mongoose.model("Collaboration", collaborationSchema);
  