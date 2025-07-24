// routes/dashboardb.js
// Updated version with new routes for user-specific data

const express = require("express");
const router = express.Router();
const Dashboard = require("../models/dashboardm"); // Your model for saved items
const Resource = require("../models/Resource");   // We need the Resource model to find user uploads
const auth = require("../middleware/auth");      // Your auth middleware

// --- ROUTES FOR SAVED/BOOKMARKED RESOURCES (Your existing logic) ---

// POST /api/dashboard/save - Add a resource to the current user's saved list
// (I've changed the name to be more descriptive)
router.post("/save", auth, async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole === 'visitor') {
      return res.status(403).json({ error: "Forbidden: Visitors cannot save resources to a dashboard." });
    }
    const { resourceId } = req.body;
    if (!resourceId) {
        return res.status(400).json({ error: "Resource ID is required." });
    }

    // Check if the item is already saved to prevent duplicates
    const existingItem = await Dashboard.findOne({ user: req.user.id, resource: resourceId });
    if (existingItem) {
        return res.status(400).json({ error: "Resource already saved to your dashboard." });
    }

    const newItem = new Dashboard({
      user: req.user.id,
      resource: resourceId,
    });

    await newItem.save();
    res.status(201).json({ message: "Added to your dashboard" });
  } catch (error) {
    console.error("Error adding to dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/dashboard/saved - Get all saved/bookmarked resources for the logged-in user
router.get("/saved", auth, async (req, res) => {
  try {
    const items = await Dashboard.find({ user: req.user.id }).populate("resource");
    // The .populate() will fill in the details of the resource (title, filename, etc.)
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// --- NEW ROUTES FOR USER'S OWN UPLOADS AND STATS ---

// GET /api/dashboard/my-uploads - Get all resources UPLOADED by the logged-in user
router.get("/my-uploads", auth, async (req, res) => {
    try {
        // Find all resources where the 'user' field matches the logged-in user's ID
        const myUploads = await Resource.find({ user: req.user.id }).sort({ uploadedAt: -1 });
        res.status(200).json(myUploads);
    } catch (error) {
        console.error("Error fetching user's uploads:", error);
        res.status(500).json({ error: "Failed to fetch your uploads." });
    }
});

// GET /api/dashboard/stats - Get statistics for the logged-in user
router.get("/stats", auth, async (req, res) => {
    try {
        // Use countDocuments for an efficient way to get the number of uploads
        const uploadCount = await Resource.countDocuments({ user: req.user.id });

        // You can add more stats here later (e.g., number of saved items)
        const savedCount = await Dashboard.countDocuments({ user: req.user.id });

        const stats = {
            uploads: uploadCount,
            saved: savedCount,
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ error: "Failed to fetch your stats." });
    }
});

// backend/routes/dashboardb.js
// Add this new DELETE route to the existing file.

// ... (keep all existing code: imports, POST route, GET routes) ...

// --- ADD THIS NEW ROUTE ---
// DELETE /api/dashboard/saved/:resourceId - Removes a resource from the user's saved list
router.delete('/saved/:resourceId', auth, async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;

    const result = await Dashboard.findOneAndDelete({ user: userId, resource: resourceId });

    if (!result) {
      return res.status(404).json({ error: "Item not found in your dashboard." });
    }

    res.status(200).json({ message: "Removed from your dashboard." });
  } catch (error) {
    console.error("Error removing from dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router; // Make sure this is at the end
