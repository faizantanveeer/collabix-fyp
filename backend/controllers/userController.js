const User = require("../models/user_model");

// Fetch user profile
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


// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, niche, socialLinks } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.niche = niche || user.niche;
    user.socialLinks = socialLinks || user.socialLinks;

    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update payment methods
const updatePaymentMethods = async (req, res) => {
  try {
    const { paymentMethods } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "influencer") {
      user.influencerDetails.paymentMethods = paymentMethods;
    } else if (user.role === "business") {
      user.businessDetails.paymentMethods = paymentMethods;
    }

    await user.save();

    return res.status(200).json({ success: true, message: "Payment methods updated successfully", user });
  } catch (error) {
    console.error("Error updating payment methods:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne(); // Or user.remove() depending on your Mongoose version
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  updatePaymentMethods,
  deleteUserAccount, // Ensure this is exported
};