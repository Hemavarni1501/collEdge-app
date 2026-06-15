import React, { useState } from "react";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from "./api";

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
      await api.post("/api/upload", data, config);
      alert("Resource uploaded successfully!");
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
        
        <div className="text-center mb-4">
          <p className="mb-2">Looking to share an event or an info post instead?</p>
          <Link to="/share-post" className="btn btn-outline-info">
            Share Info / Event
          </Link>
        </div>
        <hr style={{ borderColor: '#3a3a5e' }} />

        <h2 className="mb-4 mt-4 text-center">Upload a File Resource</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Subject Code*</label>
            <input type="text" placeholder="Enter the subject code" name="subjectCode" className="form-control" required value={formData.subjectCode} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Title*</label>
            <input type="text" placeholder="Enter the Subject Title" name="title" className="form-control" required value={formData.title} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Resource Type*</label>
            <select name="resourceType" className="form-select" required value={formData.resourceType} onChange={handleChange}>
              <option value="">-- Select Type --</option>
              <option value="Note">Note</option>
              <option value="Question Paper">Question Paper</option>
              <option value="Textbook">Textbook</option>
              <option value="Project">Project</option>
              <option value="Assignment">Assignment</option>
              <option value="Syllabus">Syllabus</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Description (optional)</label>
            <textarea name="description" placeholder="Enter a description (optional)" className="form-control" rows="3" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label">Select File*</label>
            <input 
              type="file" 
              name="file" 
              className="form-control" 
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv,.zip,.rar"
              required 
              onChange={handleFileChange} 
            />
            <small className="text-muted">Accepted: PDF, Word, PowerPoint, Excel, Images, TXT, CSV, ZIP</small>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-neon">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}