// src/Login.js
// Updated with a constrained width for better alignment.

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://colledge-backend.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      const message = error.response?.data?.error || "Invalid email or password.";
      alert(message);
    }
  };

  return (
    // --- THIS IS THE FIX ---
    // Added maxWidth style to constrain the form's width
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="text-center text-info mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-light">Email:</label>
          <input
            type="email"
            className="form-control input-neon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-light">Password:</label>
          <input
            type="password"
            className="form-control input-neon"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="text-end mb-3">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <button type="submit" className="btn btn-neon w-100">Login</button>

        <p className="text-center mt-3">
          New here? <Link to="/register/student">Register as Student</Link> | <Link to="/register/staff">Register as Staff</Link> | <Link to="/visitor">Register as Visitor</Link>
        </p>
      </form>
    </div>
  );
}