const User = require("../models/user_model");
const Collaboration = require("../models/collaboration_model");
const Payment = require("../models/payment_model");
const Message = require("../models/message_model");
const Notification = require("../models/notification_model");
const Review = require("../models/review_model"); // Add Review model import

// Get dashboard data based on user role
const dashboardHandler = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized access" }); // ✅ Return immediately
    }

    const user = await User.findOne({ email: req.user.email })
      .populate("influencerDetails.pastCollaborations");

    if (!user) {
      return res.status(404).json({ message: "User profile not found" }); // ✅ Return immediately
    }

    let dashboardData = {};

    const { role, _id } = user;

    // Fetch common data like messages and notifications
    const messagesPromise = Message.find({ receiver: _id })
      .populate("sender", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const notificationsPromise = Notification.find({ recipient: _id, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);

    let collaborationsPromise = Promise.resolve([]); // Default empty array
    let paymentsPromise = Promise.resolve([]);
    let ratingsPromise = Promise.resolve([]);

    if (role === "influencer") {
      // Fetch influencer-specific data
      collaborationsPromise = Collaboration.find({ influencer: _id })
        .populate("business", "name")
        .exec();

      paymentsPromise = Payment.find({ payee: _id });
      
      ratingsPromise = Review.find({ reviewedUser: _id });
    } else if (role === "business") {
      // Fetch business-specific data
      collaborationsPromise = Collaboration.find({ business: _id })
        .populate("influencer", "name")
        .exec();

      paymentsPromise = Payment.find({ payer: _id });
    }

    // Wait for all data fetching
    const [collaborations, payments, messages, notifications, ratings] = await Promise.all([
      collaborationsPromise,
      paymentsPromise,
      messagesPromise,
      notificationsPromise,
      ratingsPromise
    ]);
    const pendingCollaborations = collaborations ? collaborations.filter((c) => c.status === "pending") : [];
    const activeCollaborations = collaborations ? collaborations.filter((c) => c.status === "accepted") : [];
    const completedCollaborations = collaborations ? collaborations.filter((c) => c.status === "completed") : [];

    // Format social links according to schema
    const formattedSocialLinks = user.socialLinks?.map(link => ({
      platform: link.platform,
      url: link.url,
      followers: link.followers
    })) || [];

    dashboardData = {
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        niche: user.niche,
        bio: user.bio,
        location: user.location,
        profileImage: user.profileImage,
        socialLinks: formattedSocialLinks,
        totalFollowers: user.totalFollowers,
        averageRating: user.averageRating,
        ...(role === "influencer" && {
          influencerDetails: {
            pastCollaborations: user.influencerDetails?.pastCollaborations || [],
            ratings: ratings || [],
            totalFollowers: user.influencerDetails?.totalFollowers || 0
          }
        }),
        ...(role === "business" && {
          businessDetails: {
            companyName: user.businessDetails?.companyName || "",
            website: user.businessDetails?.website || "",
            industry: user.businessDetails?.industry || ""
          }
        })
      },
      collaborations: {
        pending: pendingCollaborations,
        active: activeCollaborations,
        completed: completedCollaborations,
      },
      payments,
      messages,
      notifications,
      paymentMethods: role === "influencer" ? user.influencerDetails?.paymentMethods || [] : user.businessDetails?.paymentMethods || []
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile picture path
    user.profileImage = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error("Profile Picture Update Error:", error);
    res.status(500).json({ message: "Error updating profile picture" });
  }
};

module.exports = { 
  dashboardHandler,
  updateProfilePicture 
};
