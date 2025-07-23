// src/ResourceCard.js
// Corrected JSX syntax in the card-actions section.

import React from 'react';
import { FaPlus, FaEye, FaDownload, FaTrash, FaTimes } from 'react-icons/fa';
import './ResourceCard.css';

export default function ResourceCard({ 
  resource, 
  onAddToDashboard, 
  onDelete,
  onRemoveFromDashboard,
  showAddButton = false,
  showDeleteButton = false,
  showRemoveButton = false
}) {

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="resource-card-wrapper">
      <div className="card-main-content">
        <div className="card-header">
          <span className="resource-type-badge">{resource.resourceType}</span>
          <span className="uploader-info">by {resource.user?.name || 'Unknown'}</span>
        </div>
        <div className="card-body">
          <h4 className="card-title">{resource.title}</h4>
          <p className="card-description">{resource.description || 'No description provided.'}</p>
        </div>
        <div className="card-meta">
          {/* Conditionally render Subject Code only if it exists */}
          {resource.subjectCode && <span><strong>Subject-code:</strong> {resource.subjectCode}</span>}
          <span><strong>Uploaded:</strong> {formatDate(resource.uploadedAt)}</span>
        </div>
      </div>
      
      <div className="card-actions">
        {showAddButton && (
          <button className="action-btn add" onClick={() => onAddToDashboard(resource._id)} title="Add to My Dashboard">
            <FaPlus /> Add to Dashboard
          </button>
        )}
        
        {/* --- THIS IS THE FIX --- */}
        {/* The fragment now correctly wraps all subsequent buttons */}
        {resource.filePath && (
          <>
            <a href={`http://localhost:5000/${resource.filePath}`} target="_blank" rel="noopener noreferrer" className="action-btn view" title="View File">
              <FaEye /> View
            </a>
            <a href={`http://localhost:5000/${resource.filePath}`} download className="action-btn download" title="Download File">
              <FaDownload /> Download
            </a>
          </>
        )}
        
        {showDeleteButton && (
          <button className="action-btn delete" onClick={() => onDelete(resource._id)} title="Delete This Resource">
            <FaTrash /> Delete
          </button>
        )}

        {showRemoveButton && (
          <button className="action-btn remove" onClick={() => onRemoveFromDashboard(resource._id)} title="Remove from Dashboard">
            <FaTimes /> Remove
          </button>
        )}
      </div>
    </div>
  );
}