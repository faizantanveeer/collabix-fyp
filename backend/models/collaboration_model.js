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
      enum: ['pending', 'accepted', 'declined', 'completed'], 
      default: 'pending' 
    },
    startDate: { 
      type: Date 
    },
    endDate: { 
      type: Date 
    },
    budget: { 
      type: Number 
    },
    description: { 
      type: String 
    },
    deliverables: { 
      type: String 
    },
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

// Optionally, create indexes for faster querying
collaborationSchema.index({ business: 1 });
collaborationSchema.index({ influencer: 1 });
collaborationSchema.index({ status: 1 });

module.exports = mongoose.model('Collaboration', collaborationSchema);
