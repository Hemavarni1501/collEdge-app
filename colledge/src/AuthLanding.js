// AuthLanding.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthLanding.css";

export default function AuthLanding() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <h2 className="text-center text-info">Welcome to CollEdge</h2>
      <p className="text-center text-muted">Choose your login method</p>

      <div className="auth-options">
        <div className="auth-card" onClick={() => navigate("/login")}>
          <h4>👨‍🎓 Student Login</h4>
          <p>Login if you're a student</p>
        </div>

        <div className="auth-card" onClick={() => navigate("/student")}>
          <h4>📝 Register as Student</h4>
          <p>Create a new student account</p>
        </div>

        <div className="auth-card" onClick={() => navigate("/staff")}>
          <h4>👩‍🏫 Staff Register</h4>
          <p>Create staff account</p>
        </div>

        <div className="auth-card" onClick={() => navigate("/Visitor")}>
          <h4>👀 Continue as Visitor</h4>
          <p>Register & enter without login</p>
        </div>
      </div>
    </div>
  );
}
