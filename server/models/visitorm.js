// models/visitorm.js
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: String,
  email: String,
  mn: String,
  purpose: String,
});

module.exports = mongoose.model("Visitor", visitorSchema);
