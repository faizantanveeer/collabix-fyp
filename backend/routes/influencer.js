const express = require("express");
const router = express.Router();
const User = require("../models/user_model");

// GET all influencers
router.get("/", async (req, res) => {
  try {
    const influencers = await User.find({ role: "influencer" })
      .select("name profileImage bio niche socialLinks")
      .lean(); // Optimize performance

    //   console.log(influencers)

    // Format influencer data
    const formattedInfluencers = influencers.map((influencer) => ({
      id: influencer._id,
      name: influencer.name,
      image: influencer.profileImage || "/images/placeholder.png",
      niche: influencer.niche || "Unknown",
      bio: influencer.bio || "none",
      followers:
        influencer.socialLinks?.reduce(
          (sum, link) => sum + (link.followers || 0),
          0
        ) || 0, // Ensure it's a number
    }));

    res.json(formattedInfluencers);
  } catch (error) {
    console.error("Error fetching influencers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Influencer by ID

router.get("/:id", async (req, res) => {
  try {
    const influencer = await User.findById(req.params.id).lean();

    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }

    res.status(200).json(influencer);
  } catch (error) {
    console.error("Error fetching influencer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
