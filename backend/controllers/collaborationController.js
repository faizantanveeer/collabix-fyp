const Collaboration = require("../models/collaboration_model");
const Notification = require("../models/notification_model");
const User = require("../models/user_model");

const createCollaboration = async (req, res) => {
  try {
    const { influencerId, message, budget } = req.body; // Business sends request
    const businessId = req.user._id; // Business user (from JWT)

    if (!influencerId) {
      return res.status(400).json({ message: "Influencer ID is required" });
    }

    // Check if influencer exists
    const influencer = await User.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }

    // Create a new collaboration request
    const collabRequest = new Collaboration({
      business: businessId,
      influencer: influencerId,
      message,
      budget,
      status: "pending",
    });
    await collabRequest.save();

    // Create a notification for the influencer
    const notification = new Notification({
      recipient: influencerId,
      message: `New collaboration request from ${req.user.name}`,
      type: "collaboration_request",
    });
    await notification.save();

    res.status(201).json({
      success: true,
      message: "Collaboration request sent successfully",
      collaboration: collabRequest,
      notification,
    });
  } catch (error) {
    console.error("Collaboration Request Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const sendCollaborationRequest = async(req, res) => {
  try {
    const { influencerId,businessId, message } = req.body;

    const collabRequest = new Collaboration({
      business: businessId,
      influencer: influencerId,
      message,
      status: "pending",
    });

    await collabRequest.save();
    res.status(201).json({ success: true, message: "Collaboration request sent!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const respondToCollabRequest = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"
    const collaborationId = req.params.id;
    const influencerId = req.user._id;

    // Check if Collaboration exists
    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    // Ensure only the influencer can respond
    if (collaboration.influencer.toString() !== influencerId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update status
    collaboration.status = status;
    await collaboration.save();

    // Create Notification for Business
    const notification = new Notification({
      recipient: collaboration.business,
      message: `Your collaboration request was ${status} by ${req.user.name}`,
      type: "collab_response"
    });

    await notification.save();

    res.json({
      success: true,
      message: `Collaboration request ${status}`,
      collaboration,
      notification
    });
  } catch (error) {
    console.error("Collaboration Response Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { createCollaboration ,sendCollaborationRequest, respondToCollabRequest};
