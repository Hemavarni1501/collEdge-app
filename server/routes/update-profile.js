// routes/update-profile.js
// Updated and corrected version

const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth'); // We need middleware to identify the user
const User = require("../models/User"); // Our new, single User model

// The PUT route now uses the auth middleware
router.put("/", auth, async (req, res) => {
  // The user's ID is now securely taken from the token, not from the request body.
  const userId = req.user.id;

  // We get the fields to update from the request body.
  // We should not allow updating the role, username, or email this way for security.
  const { name, mn, college } = req.body;

  try {
    // We create an object with only the fields we want to update.
    const fieldsToUpdate = {
      name,
      mn,
      college
    };

    // Find the user by their ID (from the token) and update their data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: fieldsToUpdate }, // Use $set to update only specified fields
      { new: true } // This option returns the updated document
    ).select('-password'); // .select('-password') prevents the hashed password from being sent back

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send back a success message and the updated user object
    res.json({ 
        message: "Profile updated successfully",
        user: updatedUser // Sending the fresh user data back is good practice
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error during profile update" });
  }
});

module.exports = router;

