const Notification = require("../models/notification_model");

// Fetch notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Ensure it's correctly exported
module.exports = { getNotifications };
