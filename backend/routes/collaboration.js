const express = require("express");
const router = express.Router();
const upload = require('../utils/multer')
const {
  createCollaboration,statusHandler,getCollaborationInfluencer,
} = require("../controllers/collaborationController");

// Route to create a new collaboration
router.post("/create", upload.single("file"),createCollaboration);


router.put('/:id/status', statusHandler)


// Route to get all collaborations (can add filtering as needed)
router.get("/influencer/:id", getCollaborationInfluencer);

// Route to update collaboration status (e.g., accepted, declined)
// router.put("/:id/status", updateCollaborationStatus);

module.exports = router;
