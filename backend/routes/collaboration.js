const express = require("express");
const router = express.Router();
const upload = require('../utils/multer')
const {
  createCollaboration,
  statusHandler,
  getCollaborationInfluencer,
  deleteCollaboration
} = require("../controllers/collaborationController");

const { updateProfilePicture } = require("../controllers/dashboardController");

// Route to create a new collaboration
router.post("/create", upload.single("file"), createCollaboration);

// Route to update profile picture
router.post("/profile-picture", upload.single("profileImage"), updateProfilePicture);

router.put('/:id/status', statusHandler);

router.delete('/:id/delete', deleteCollaboration);

// Route to get all collaborations (can add filtering as needed)
router.get("/influencer/:id", getCollaborationInfluencer);

// Route to update collaboration status (e.g., accepted, declined)
// router.put("/:id/status", updateCollaborationStatus);

module.exports = router;
