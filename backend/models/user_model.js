const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["business", "influencer"], required: true },
    profileImage: { type: String },
    location: { type: String },
    bio: { type: String },
    influencerDetails: {
      socialLinks: [{ type: String }],
      followerCount: { type: Number },
      engagementRate: { type: Number },
      niche: { type: String },
      pastCollaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
      ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    },
    businessDetails: {
      companyName: { type: String },
      website: { type: String },
      industry: { type: String },
      pastCollaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
