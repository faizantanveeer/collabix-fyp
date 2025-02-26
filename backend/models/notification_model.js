const mongoose = require('mongoose');

// Define the schema for notifications
const notificationSchema = new mongoose.Schema(
  {
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',  // Reference to the User model (business or influencer)
      required: true 
    },
    type: { 
      type: String, 
      enum: ['collaboration', 'payment', 'message', 'system'],  // Different types of notifications
      required: true 
    },
    message: { 
      type: String, 
      required: true  // The content/message of the notification
    },
    isRead: { 
      type: Boolean, 
      default: false  // Tracks if the notification has been read by the recipient
    },
    createdAt: { 
      type: Date, 
      default: Date.now  // Timestamp of when the notification was created
    },
  },
  { timestamps: true }  // This will automatically add `createdAt` and `updatedAt` fields
);

// Index to optimize queries by recipient and read status
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);  // Export the Notification model
