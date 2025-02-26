const express = require("express");
const router = express.Router();

// Import controller functions for collaborations
const { 
  createCollaboration, 
  getCollaborations, 
  updateCollaborationStatus 
} = require("../controllers/collaborationController");

// Route to create a new collaboration
router.post("/", createCollaboration);

// Route to get all collaborations (can add filtering as needed)
router.get("/", getCollaborations);

// Route to update collaboration status (e.g., accepted, declined)
router.put("/:id/status", updateCollaborationStatus);

module.exports = router;
