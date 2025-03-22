const express = require("express");
const chatbotController = require("../controllers/chatbotController");
const router = express.Router();

router.post("/", chatbotController)

module.exports = router;
