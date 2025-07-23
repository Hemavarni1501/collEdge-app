// routes/visitorb.js
const express = require("express");
const router = express.Router();
const Visitor = require("../models/visitorm");

router.post("/", async (req, res) => {
  try {
    const { name, email, mn, purpose } = req.body;

    if (!name || !email || !mn || !purpose) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newVisitor = new Visitor({ name, email, mn, purpose });
    await newVisitor.save();

    res.status(201).json({ message: "Visitor registered successfully" });
  } catch (error) {
    console.error("Error registering visitor:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
