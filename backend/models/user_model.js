const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["business", "influencer"], required: true },
    profileImage: { type: String },
    bio: { type: String },
    niche: { type: String },
    location: { type: String },

    // Social Media & Analytics
    socialLinks: [
      {
        platform: { type: String, enum: ["Instagram", "Twitter", "Facebook", "YouTube", "TikTok", "LinkedIn"] },
        link: { type: String },
        followers: { type: Number, default: 0 },
      },
    ],

    // Influencer-Specific Fields
    influencerDetails: {
      pastCollaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }],
      ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    },

    // Business-Specific Fields
    businessDetails: {
      companyName: { type: String },
      website: { type: String },
      industry: { type: String },
    },

    // Virtual fields (computed values)
  },
  { timestamps: true }
);

// Virtual field for total followers
userSchema.virtual("totalFollowers").get(function () {
  return this.socialLinks?.reduce((total, link) => total + (link.followers || 0), 0);
});

// Virtual field for average influencer rating
userSchema.virtual("averageRating").get(function () {
  if (!this.influencerDetails?.ratings || this.influencerDetails.ratings.length === 0) return 0;
  return this.influencerDetails.ratings.reduce((sum, review) => sum + review.rating, 0) / this.influencerDetails.ratings.length;
});

module.exports = mongoose.model("User", userSchema);
