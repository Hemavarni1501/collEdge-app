// server/middleware/auth.js
// Updated to use JWT_SECRET from .env

const jwt = require("jsonwebtoken");

// --- THIS IS THE FIX ---
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Auth token missing" });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid or expired token. Please log in again." });
  }
};