// src/Register.js
// Updated with constrained width and corrected field names.

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const location = useLocation();
  const role = location.pathname.split("/")[2];

  // --- FIX #2: Corrected state field name ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mn: "", // Changed from 'mobilenumber' to 'mn' to match backend
    college: "",
    username: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const pageTitle = role.charAt(0).toUpperCase() + role.slice(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const registrationData = {
      ...formData,
      role: role,
    };

    try {
      await axios.post("https://colledge-backend.onrender.com/api/auth/register", registrationData);
      alert(`🎉 ${pageTitle} registered successfully!`);
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed. Please try again.";
      alert(message);
    }
  };

  // --- FIX #2: Corrected field names in this array ---
  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'mn', label: 'Mobile Number', type: 'text' },
    { name: 'college', label: 'College', type: 'text' },
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
  ];

  return (
    // --- FIX #1: Added maxWidth style to the container ---
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="text-center text-info mb-4">{pageTitle.toUpperCase()} REGISTRATION</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="form-label text-light">{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              className="form-control input-neon" // Assuming input-neon is in theme.css
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-neon w-100">Submit</button>
        <p className="text-center mt-3">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}