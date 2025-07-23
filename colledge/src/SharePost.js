// src/SharePost.js
// Now with an optional file upload feature.

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';
import './SharePost.css';

export default function SharePost() {
  const [postType, setPostType] = useState('Info');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
  });
  const [file, setFile] = useState(null); // State for the optional file
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { alert('You must be logged in to share a post.'); return; }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('resourceType', postType);

    if (postType === 'Event') {
      data.append('eventDate', formData.eventDate);
      data.append('location', formData.location);
    }

    if (file) {
      data.append('file', file);
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      await axios.post('http://localhost:5000/api/upload', data, config);
      alert(`${postType} shared successfully!`);
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.error || `Failed to share ${postType}.`);
    }
  };

  return (
    <div className="share-post-container">
      <div className="post-form-wrapper">
        <h2 className="form-title">Share an Update</h2>
        <p className="form-subtitle">Post important information or announce an upcoming event.</p>
        
        <div className="post-type-selector">
          <button className={`type-btn ${postType === 'Info' ? 'active' : ''}`} onClick={() => setPostType('Info')}>
            <FaInfoCircle /> Info
          </button>
          <button className={`type-btn ${postType === 'Event' ? 'active' : ''}`} onClick={() => setPostType('Event')}>
            <FaCalendarAlt /> Event
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input type="text" placeholder='Enter the Title ' id="title" name="title" required value={formData.title} onChange={handleChange} />
          </div>

          {postType === 'Event' && (
            <>
              <div className="form-group">
                <label htmlFor="eventDate">Event Date*</label>
                <input type="date" id="eventDate" name="eventDate" required value={formData.eventDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location / Venue*</label>
                <input type="text" placeholder='Enter the Location of the Event ' id="location" name="location" required value={formData.location} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea id="description" placeholder='Enter the Description ' name="description" rows="6" required value={formData.description} onChange={handleChange}></textarea>
          </div>
          
          {/* --- THE OPTIONAL FILE UPLOAD FIELD --- */}
          <div className="form-group">
            <label htmlFor="file-upload">
              <FaPaperclip /> Attach a File (Optional)
            </label>
            <p className="file-upload-subtitle">Add a poster, schedule, or video.</p>
            <input type="file" id="file-upload" name="file" onChange={handleFileChange} className="file-input" />
          </div>
          {file && <p className="selected-file-name">Selected: {file.name}</p>}

          <button type="submit" className="submit-btn-neon">
            Share {postType}
          </button>
        </form>
      </div>
    </div>
  );
}