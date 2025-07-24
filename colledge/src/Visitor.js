// src/Visitor.js
// The new, proper registration form for visitors.

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function VisitorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "visitor", // The role is fixed
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call the same universal registration endpoint
      await axios.post("https://colledge-backend.onrender.com/api/auth/register", formData);
      alert("Visitor account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="text-center text-info mb-4">VISITOR REGISTRATION</h2>
      <p className="text-center text-light mb-4">Create an account to save and track resources.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-light">Full Name:</label>
          <input type="text" placeholder="Enter your full name" name="name" className="form-control input-neon" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label text-light">Email:</label>
          <input type="email" placeholder="Enter your email" name="email" className="form-control input-neon" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label text-light">Username:</label>
          <input type="text" placeholder="Enter a username" name="username" className="form-control input-neon" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label text-light">Password:</label>
          <input type="password" placeholder="Enter a password" name="password" className="form-control input-neon" required onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-neon w-100">Create Account</button>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}