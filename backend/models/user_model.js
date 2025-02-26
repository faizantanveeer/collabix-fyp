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
    verified: { type: Boolean, default: false },
    kycVerified: { type: Boolean, default: false },
    niche: { type: String },
    socialLinks: [
      {
        platform: { type: String, enum: ["Instagram", "Twitter", "Facebook", "YouTube", "TikTok", "LinkedIn"] },
        link: { type: String },
        followers: { type: Number },
        engagementRate: { type: Number },
        verified: { type: Boolean, default: false },
      },
    ],
    analytics: [
      {
        month: { type: String },
        followers: { type: Number },
        engagementRate: { type: Number },
      },
    ],
    influencerDetails: {
      pastCollaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
      ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
      paymentMethods: [
        {
          type: { type: String, enum: ["JazzCash", "EasyPaisa", "NayaPay", "SadaPay", "Bank Transfer"] },
          details: { type: String },
        },
      ],
    },
    businessDetails: {
      companyName: { type: String },
      website: { type: String },
      industry: { type: String },
      pastCollaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
      paymentMethods: [
        {
          type: { type: String, enum: ["JazzCash", "EasyPaisa", "NayaPay", "SadaPay", "Bank Transfer"] },
          details: { type: String },
        },
      ],
    },
    portfolio: [
      {
        title: { type: String },
        description: { type: String },
        mediaLink: { type: String },
      },
    ],
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    notifications: [
      {
        type: { type: String, enum: ["collaboration", "payment", "message", "system"] },
        message: { type: String },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    preferences: {
      darkMode: { type: Boolean, default: false },
      notificationSettings: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

userSchema.virtual("totalFollowers").get(function () {
  return this.socialLinks.reduce((total, link) => total + (link.followers || 0), 0);
});

userSchema.virtual("averageRating").get(function () {
  if (!this.influencerDetails.ratings || this.influencerDetails.ratings.length === 0) return 0;
  return this.influencerDetails.ratings.length > 0
    ? this.influencerDetails.ratings.reduce((sum, review) => sum + review.rating, 0) / this.influencerDetails.ratings.length
    : 0;
});

module.exports = mongoose.model("User", userSchema);
