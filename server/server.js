// server/server.js
// Final corrected version with the static path fixed.

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

// --- Core Middleware ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://colledge-djbt79vif-hemavarni1501s-projects.vercel.app',
  // Add your production frontend URL here
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now, restrict in production
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Static File Serving Middleware ---
// Serve locally uploaded files from the server/uploads directory.
// Note: New uploads go to Cloudinary, but this keeps old local files accessible.
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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB 🚀'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0' , () => {
  console.log(`Server running on port: ${PORT}`);
});