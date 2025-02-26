const Message = require("../models/message_model");

// Controller function to create a new message
const createMessage = async (req, res) => {
  try {
    const { sender, receiver, content, messageType, fileUrl, collaboration } = req.body;

    const newMessage = new Message({
      sender,
      receiver,
      content,
      messageType,
      fileUrl,
      collaboration,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
};

// Controller function to get messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate("sender", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Controller function to delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

module.exports = { createMessage, getMessages, deleteMessage };
