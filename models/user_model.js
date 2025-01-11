const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../config/db')


const userSchema = new Schema({
  name: String,
  email: String,
  password: String, // Hashed
  role: { type: String, enum: ["Business", "Influencer"], required: true },
  profileDetails: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
