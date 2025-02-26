const mongoose = require("mongoose");

const MESSAGE_TYPES = ["text", "file", "system"];

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String }, // Optional if file is present
    messageType: { 
      type: String, 
      enum: MESSAGE_TYPES, 
      default: "text" 
    },
    fileUrl: { type: String }, // URL of the file (e.g., image, PDF)
    read: { type: Boolean, default: false }, // Track if the message has been read
    collaboration: { type: mongoose.Schema.Types.ObjectId, ref: "Collaboration" }, // Optional collaboration link
    deletedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        deletedAt: { type: Date }
      }
    ]
  },
  { timestamps: true }
);

// Indexes for faster querying
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ read: 1 });
messageSchema.index({ collaboration: 1 });

module.exports = mongoose.model("Message", messageSchema);
