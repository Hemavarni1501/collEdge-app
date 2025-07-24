// src/Upload.js
// Restored to its original purpose for file-based academic resources.

import React, { useState } from "react";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    subjectCode: "",
    title: "",
    resourceType: "",
    description: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { alert("You must be logged in to upload."); return; }
    if (!file) { alert("Please select a file to upload."); return; }

    const data = new FormData();
    data.append("subjectCode", formData.subjectCode);
    data.append("title", formData.title);
    data.append("resourceType", formData.resourceType);
    data.append("description", formData.description);
    data.append("file", file);

    try {
      const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      await axios.post("https://colledge-backend.onrender.com/api/upload", data, config);
      alert("Resource uploaded successfully!");
      // Reset the form
      setFormData({ subjectCode: "", title: "", resourceType: "", description: "" });
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (error) {
      alert(error.response?.data?.error || "Upload failed.");
    }
  };

  return (
    <div className="container py-5 text-white">
      <div className="p-4 rounded" style={{ background: "#1e1e2f", maxWidth: "600px", margin: "0 auto" }}>
        
        {/* Link to the other sharing page */}
        <div className="text-center mb-4">
          <p className="mb-2">Looking to share an event or an info post instead?</p>
          <Link to="/share-post" className="btn btn-outline-info">
            Share Info / Event
          </Link>
        </div>
        <hr style={{ borderColor: '#3a3a5e' }} />

        <h2 className="mb-4 mt-4 text-center">Upload a File Resource</h2>
        <form onSubmit={handleSubmit}>
          {/* Subject Code */}
          <div className="mb-3">
            <label className="form-label">Subject Code*</label>
            <input type="text" placeholder="Enter the subject code" name="subjectCode" className="form-control" required value={formData.subjectCode} onChange={handleChange} />
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title*</label>
            <input type="text" placeholder="Enter the Subject Title" name="title" className="form-control" required value={formData.title} onChange={handleChange} />
          </div>

          {/* Resource Type Dropdown (Original Options) */}
          <div className="mb-3">
            <label className="form-label">Resource Type*</label>
            <select name="resourceType" className="form-select" required value={formData.resourceType} onChange={handleChange}>
              <option value="">-- Select Type --</option>
              <option value="Notes">Notes</option>
              <option value="Question Paper">Question Paper</option>
              <option value="Textbook">Textbook</option>
              <option value="Project">Project</option>
              <option value="Assignment">Assignment</option>
              <option value="Syllabus">Syllabus</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description (optional)</label>
            <textarea name="description" placeholder="Enter a description (optional)" className="form-control" rows="3" value={formData.description} onChange={handleChange}></textarea>
          </div>

          {/* File Upload (Now always required for this form) */}
          <div className="mb-4">
            <label className="form-label">Select File*</label>
            <input type="file" name="file" className="form-control" required onChange={handleFileChange} />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-neon">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}