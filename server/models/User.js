// models/User.js
// This new file replaces studentm.js and staffm.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mn: { type: String }, // mobile number
  college: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   role: {
    type: String,
    enum: ['student', 'staff', 'visitor'], // <-- ADD 'visitor' HERE
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);