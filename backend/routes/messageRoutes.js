const express = require("express");
const router = express.Router();

// Import controller functions for messages
const { createMessage, getMessages, deleteMessage } = require("../controllers/messageController");

// Route to create a new message
router.post("/", createMessage);

// Route to get messages (filtering can be applied as needed)
router.get("/", getMessages);

// Route to delete a message
router.delete("/:id", deleteMessage);

module.exports = router;
