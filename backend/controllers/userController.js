const User = require("../models/user_model");

const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized access" }); // ✅ Return immediately
    }

    const userProfile = await User.findOne({ email: req.user.email });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" }); // ✅ Return immediately
    }

    const profileData = {
      id: userProfile._id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      ...(userProfile.role === "influencer" && { influencerDetails: userProfile.influencerDetails }),
      ...(userProfile.role === "business" && { businessDetails: userProfile.businessDetails }),
    };

    return res.status(200).json({ data: profileData }); // ✅ Ensure single response

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Server error" }); // ✅ Ensure single response
  }
};

module.exports = { getUserProfile };
