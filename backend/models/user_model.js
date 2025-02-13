const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["business", "influencer"], required: true },
    influencerDetails: {
      socialLinks: [{ type: String }],
      followerCount: { type: Number },
      category: { type: String },
    },
    businessDetails: {
      companyName: { type: String },
      website: { type: String },
      industry: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
