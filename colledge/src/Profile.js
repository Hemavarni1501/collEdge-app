// src/Profile.js
// Updated to include the Logout button again.

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState(user || {});
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setUpdatedData(currentUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value, }));
  };

  const handleUpdate = async () => {
    // ... This function will be fixed once you send the backend file ...
    // For now, the logic remains the same.
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Authentication error. Please log in again.');
        return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const res = await axios.put("https://colledge-backend.onrender.com/api/update-profile", updatedData, config);
      alert("Profile updated successfully!");
      const freshUserData = res.data.user || updatedData;
      localStorage.setItem("user", JSON.stringify(freshUserData));
      setUser(freshUserData);
      setEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile. " + (error.response?.data?.error || ""));
    }
  };

  // --- ADD THIS FUNCTION BACK ---
  const handleLogout = () => {
    alert("You have been logged out.");
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Important: remove the token too
    window.location.href = "/login";
  };

  if (!user) {
    return ( <div> <p className="container mt-5">Not a Registered User...</p> </div> );
  }

  return (
    <div>
        <div className="profile-container container mt-4">
        <div className="profile-card p-4">
            <h2 className="profile-title">👤 Profile</h2>
            <div className="profile-table">
                {/* ... (Your existing JSX for displaying user data) ... */}
                <div><b>Role</b></div><div>:</div><div>{user.role || user.userType}</div>
                <div><b>Name</b></div><div>:</div>
                <div>{editMode ? <input name="name" className="form-control" value={updatedData.name} onChange={handleChange} /> : user.name}</div>
                <div><b>Email</b></div><div>:</div>
                <div>{editMode ? <input name="email" className="form-control" value={updatedData.email} onChange={handleChange} /> : user.email}</div>
                {(user.role === "student" || user.role === "staff") && (
                    <>
                    <div><b>Mobile No</b></div><div>:</div>
                    <div>{editMode ? <input name="mn" className="form-control" value={updatedData.mn} onChange={handleChange} /> : user.mn}</div>
                    <div><b>College</b></div><div>:</div>
                    <div>{editMode ? <input name="college" className="form-control" value={updatedData.college} onChange={handleChange} /> : user.college}</div>
                    <div><b>Username</b></div><div>:</div>
                    <div>{user.username}</div>
                    </>
                )}
            </div>

            <div className="profile-buttons mt-4">
                {editMode ? (
                    <button className="btn btn-info me-2" onClick={handleUpdate}>Save</button>
                ) : (
                    <button className="btn btn-info me-2" onClick={() => setEditMode(true)}>Edit</button>
                )}
                {/* --- ADD THE LOGOUT BUTTON BACK --- */}
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
        </div>
    </div>
  );
}