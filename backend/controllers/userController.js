const User = require("../models/user_model");

// Fetch user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      niche: user.niche,
      bio: user.bio,
      location: user.location,
      profileImage: user.profileImage,
      socialLinks: user.socialLinks || [],
      totalFollowers: user.totalFollowers,
      averageRating: user.averageRating,
      website: user.businessDetails?.website || "",
      industry: user.businessDetails?.industry || user.niche || "",
      ...(user.role === "influencer" && {
        influencerDetails: user.influencerDetails
      }),
      ...(user.role === "business" && {
        businessDetails: user.businessDetails
      })
    };

    res.json({ profile: profileData });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    user.name = updateData.name || user.name;
    user.bio = updateData.bio || user.bio;
    user.niche = updateData.niche || user.niche;
    user.location = updateData.location || user.location;

    // Update role-specific details
    if (user.role === "business" && updateData.businessDetails) {
      user.businessDetails = {
        ...user.businessDetails,
        ...updateData.businessDetails
      };
    } else if (user.role === "influencer" && updateData.influencerDetails) {
      user.influencerDetails = {
        ...user.influencerDetails,
        ...updateData.influencerDetails
      };
    }

    await user.save();
    res.json({ profile: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Update profile image
const updateProfileImage = async (req, res) => {


  try {
    const { id } = req.params;  // Ensure you're getting the correct user ID
    

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);
    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    console.log(req.file)

    user.profileImage = req.file.filename; // Assuming Multer saves the file path
    await user.save();

    res.json({ message: "Profile image updated", user });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Error updating profile image" });
  }
};




module.exports = {
  getUserProfile,
  updateProfile,
  updateProfileImage,

};