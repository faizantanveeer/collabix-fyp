const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaboration: { type: mongoose.Schema.Types.ObjectId, ref: "Collaboration", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
    helpfulVotes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

reviewSchema.index({ reviewer: 1, reviewedUser: 1, collaboration: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (userId) {
  const result = await this.aggregate([
    { $match: { reviewedUser: userId } },
    { $group: { _id: "$reviewedUser", averageRating: { $avg: "$rating" } } },
  ]);

  return result.length ? result[0].averageRating : 0;
};

// Auto-update user's average rating when a new review is added
reviewSchema.post("save", async function () {
  const Review = this.constructor;
  const User = mongoose.model("User");
  const averageRating = await Review.calculateAverageRating(this.reviewedUser);

  await User.findByIdAndUpdate(this.reviewedUser, { $set: { averageRating } });
});

module.exports = mongoose.model("Review", reviewSchema);
