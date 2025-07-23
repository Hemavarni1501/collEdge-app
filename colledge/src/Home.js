// src/HomePage.js
// Corrected to use singular resource types for accurate searching.

import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from "react-router-dom";
import './Home.css';

// --- THE FIX IS HERE ---
// Changed titles to singular to match the data being saved in the database.
// This ensures the links on the cards work correctly.
const features = [
  { title: "Question Paper" },
  { title: "Note" },         // Changed from Notes
  { title: "Info" },
  { title: "Textbook" },     // Changed from Books
  { title: "Project" },
  { title: "Assignment" },
  { title: "Syllabus" },
  { title: "Event" },        // Changed from Events
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <div>
      <form className="input-group shadow-sm p-4" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control bg-dark text-white border-info"
          placeholder="Search for any resource by title, subject, or type..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="btn btn-info" type="submit">
          Search
        </button>
      </form>

      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">Choose Your Resource!</h2>
        
        <div className="resource-grid">
          {features.map((item, index) => (
            <Link 
              to={`/search?q=${encodeURIComponent(item.title)}`} 
              className="pretty-card-link"
              key={index}
            >
              <div className="pretty-card">
                {/* This will now display the singular form, e.g., "Event" */}
                <h5>{item.title}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}