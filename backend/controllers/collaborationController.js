const Collaboration = require("../models/collaboration_model");

// Create a new collaboration
const createCollaboration = async (req, res) => {
  try {
    const { business, influencer, campaign, startDate, endDate, budget } = req.body;

    // Ensure all required fields are provided
    if (!business || !influencer || !campaign || !startDate || !endDate || !budget) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new collaboration instance
    const newCollaboration = new Collaboration({
      business,
      influencer,
      campaign,
      startDate,
      endDate,
      budget,
      status: "pending",  // Default status for new collaborations
    });

    // Save the new collaboration
    await newCollaboration.save();

    return res.status(201).json({ message: "Collaboration created successfully", collaboration: newCollaboration });
  } catch (error) {
    console.error("Error creating collaboration:", error);
    return res.status(500).json({ error: "Failed to create collaboration" });
  }
};

// Get all collaborations (can be filtered based on user role or other criteria)
const getCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find()
      .populate("business", "name")   // Populate business name
      .populate("influencer", "name") // Populate influencer name
      .exec();
      
    return res.status(200).json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return res.status(500).json({ error: "Failed to fetch collaborations" });
  }
};

// Update collaboration status (e.g., accepted, declined)
const updateCollaborationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate that the status is one of the predefined values
    const validStatuses = ["pending", "accepted", "declined", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    // Find the collaboration and update its status
    const collaboration = await Collaboration.findByIdAndUpdate(id, { status }, { new: true });

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    return res.status(200).json({ message: "Collaboration status updated successfully", collaboration });
  } catch (error) {
    console.error("Error updating collaboration status:", error);
    return res.status(500).json({ error: "Failed to update collaboration status" });
  }
};

module.exports = { createCollaboration, getCollaborations, updateCollaborationStatus };
