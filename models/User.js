const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // Email must be unique
  profilePicture: { type: String, default: "" }, // Optional profile picture
  password: { type: String, required: true }, // Hashed password for authentication
  role: { 
    type: String, 
    enum: ["Standard User", "Organizer", "Admin"], 
    required: true 
  } // User role (Standard, Organizer, Admin)
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const User = mongoose.model("User", userSchema);
module.exports = User;
