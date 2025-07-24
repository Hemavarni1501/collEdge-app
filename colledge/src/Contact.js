// src/Contact.js
// Updated and corrected version

import React, { useState } from 'react';
import axios from 'axios';

// Add any specific CSS you have for this page
// import './Contact.css'; 

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- THE FIX IS HERE ---
      // Use the correct, prefixed API route
      await axios.post('https://colledge-backend.onrender.com/api/contact', formData);
      alert('Message sent successfully!');
      // Clear the form after submission
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to send contact form:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="contact">
      <div className="container mt-5">
        <div className="p-4 rounded" style={{ background: "#1e1e2f", maxWidth: "600px", margin: "0 auto" }}>
          <h2 className="text-center text-info mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" name="name" className="form-control" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <input type="email" name="email" className="form-control" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <input type="text" name="subject" className="form-control" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <textarea name="message" className="form-control" rows="2" placeholder="Your Message" required value={formData.message} onChange={handleChange}></textarea>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-neon">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}