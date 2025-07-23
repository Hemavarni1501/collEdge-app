// server/routes/auth.js
// Updated to use JWT_SECRET from .env

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// --- THIS IS THE FIX ---
// The secret is now securely loaded from your environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// --- REGISTRATION ROUTE ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, mn, college, username, password, role } = req.body;
    if (!name || !email || !username || !password || !role) {
      return res.status(400).json({ error: "Name, email, username, password, and role are required." });
    }
    if (role !== 'student' && role !== 'staff' && role !== 'visitor') {
      return res.status(400).json({ error: "Invalid role." });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mn, college, username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const tokenPayload = { userId: user._id, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, username: user.username, role: user.role, mn: user.mn, college: user.college },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;