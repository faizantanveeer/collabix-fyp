const mongoose = require('mongoose');

// Define the schema for collaborations
const collaborationSchema = new mongoose.Schema(
  {
    business: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',  // Reference to the 'User' model (Business user)
      required: true 
    },
    influencer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',  // Reference to the 'User' model (Influencer user)
      required: true 
    },
    campaign: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected', 'completed'], 
      default: 'pending' 
    },
    startDate: { 
      type: Date 
    },
    endDate: { 
      type: Date 
    },
    budget: { 
      type: Number, 
      required: true 
    },
    description: { 
      type: String,
      required: true
    },
    deliverables: { 
      type: String,
      required: true
    },
    file: {
      type: String, // This will store the file path
      default: null,
    }
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('Collaboration', collaborationSchema);
