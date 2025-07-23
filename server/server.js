// server/server.js
// Updated to load .env variables

// --- THIS IS THE FIX ---
// Load environment variables from .env file at the very top
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// --- Import Routes ---
const authRoutes = require("./routes/auth.js");
const uploadRoute = require("./routes/uploadRoute");
const searchRoutes = require('./routes/search');
const dashboardRoutes = require('./routes/dashboardb');
const contactRoutes = require('./routes/contactb');
const visitorRoute = require("./routes/visitorb");
const updateProfileRoute = require("./routes/update-profile");
const passwordResetRoutes = require('./routes/passwordResetRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordResetRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/visitor", visitorRoute);
app.use("/api/update-profile", updateProfileRoute);

// --- Database Connection ---
// --- THIS IS THE FIX ---
// Use the variable from the .env file instead of a hardcoded string
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB 🚀'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Server Start ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});