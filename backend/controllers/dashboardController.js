const User = require("../models/user_model");
const Collaboration = require("../models/collaboration_model");
const Payment = require("../models/payment_model");
const Message = require("../models/message_model");
const Notification = require("../models/notification_model");

// Get dashboard data based on user role
const dashboardHandler = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized access" }); // ✅ Return immediately
    }

    const user = await User.findOne({ email: req.user.email });

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
      
    if (role === "influencer") {
      // Fetch influencer-specific data
      collaborationsPromise = Collaboration.find({ influencer: _id })
        .populate("business", "name")
        .exec();

      paymentsPromise = Payment.find({ payee: _id });
    } else if (role === "business") {
      // Fetch business-specific data
      collaborationsPromise = Collaboration.find({ business: _id })
        .populate("influencer", "name")
        .exec();

      paymentsPromise = Payment.find({ payer: _id });
    }

    // Wait for all data fetching
    const [collaborations, payments, messages, notifications] = await Promise.all([
      collaborationsPromise,
      paymentsPromise,
      messagesPromise,
      notificationsPromise,
    ]);
    const pendingCollaborations = collaborations ? collaborations.filter((c) => c.status === "pending") : [];
    const activeCollaborations = collaborations ? collaborations.filter((c) => c.status === "accepted") : [];
    const completedCollaborations = collaborations ? collaborations.filter((c) => c.status === "completed") : [];
    

    dashboardData = {
      profile: {
        name: user.name,
        email: user.email,
        role: user.role,
        niche: user.niche,
        bio: user.bio,
        location: user.location,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        totalFollowers: user.totalFollowers || 0, // Default to 0 if not set
        averageRating: user.averageRating || 0, // Default to 0 if not set
        companyName: user.businessDetails?.companyName || "N/A",
        industry: user.businessDetails?.industry || "N/A",
        website: user.businessDetails?.website || "N/A",
      },
      collaborations: {
        pending: pendingCollaborations,
        active: activeCollaborations,
        completed: completedCollaborations,
      },
      payments,
      messages,
      notifications,
      paymentMethods: role === "influencer" ? user.influencerDetails?.paymentMethods : user.businessDetails?.paymentMethods || [],
    };

    // console.log(dashboardData)
    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { dashboardHandler };
