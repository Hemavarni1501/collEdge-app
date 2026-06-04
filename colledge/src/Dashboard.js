// src/Dashboard.js
// The complete, final version with all features.

import React, { useEffect, useState } from "react";
import api from "./api";
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import "./Dashboard.css"; // Assuming you have a Theme.css for styling

export default function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [stats, setStats] = useState({ uploads: 0, saved: 0 });
  const [myUploads, setMyUploads] = useState([]);
  const [savedResources, setSavedResources] = useState([]); // New state for saved items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API Call Handlers ---
  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource? This cannot be undone.")) return;
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await api.delete(`/api/upload/${resourceId}`, config);
      setMyUploads(myUploads.filter(r => r._id !== resourceId));
      setStats(prev => ({ ...prev, uploads: prev.uploads - 1 }));
      alert('Resource deleted successfully.');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete resource.');
    }
  };
  
  const handleRemoveFromDashboard = async (resourceId) => {
    if (!window.confirm("Are you sure you want to remove this from your dashboard?")) return;
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await api.delete(`/api/dashboard/saved/${resourceId}`, config);
      setSavedResources(savedResources.filter(item => item.resource._id !== resourceId));
      setStats(prev => ({...prev, saved: prev.saved - 1}));
      alert('Removed from dashboard.');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to remove resource.');
    }
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setError("Not logged in"); setLoading(false); return; }
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      try {
        const [statsRes, uploadsRes, savedRes] = await Promise.all([
          api.get("/api/dashboard/stats", config),
          api.get("/api/dashboard/my-uploads", config),
          api.get("/api/dashboard/saved", config) // Fetch saved resources
        ]);
        setStats(statsRes.data);
        setMyUploads(uploadsRes.data);
        setSavedResources(savedRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-light">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '500px' }}>
          <h4>⚠️ Error</h4>
          <p>{error}</p>
          <button className="btn btn-neon" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <div className="container dashboard-wrapper mt-5">
        <h2 className="text-center mb-4">👋 Welcome, {user.name}!</h2>
        
        {/* --- STATS SECTION --- */}
        <div className="row text-center mb-5 stats-section">
          <div className="col-md-6">
            <div className="stat-card">
              <h4>{stats.uploads}</h4>
              <p>Your Uploads</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="stat-card">
              <h4>{stats.saved}</h4>
              <p>Saved Resources</p>
            </div>
          </div>
        </div>

        {/* --- SAVED RESOURCES SECTION --- */}
        <div className="dashboard-section">
          <h3 className="mb-4">Saved Resources</h3>
          <div className="row">
            {savedResources.length === 0 ? (
              <div className="col text-center"><p>You haven't saved any resources yet. Find some on the <Link to="/home">Home</Link> page!</p></div>
            ) : (
              savedResources.map(item => (
                <div className="col-lg-6 mb-4" key={item._id}>
                  <ResourceCard 
                    resource={item.resource} // Note: the data is nested under `item.resource`
                    onRemoveFromDashboard={handleRemoveFromDashboard}
                    showRemoveButton={true}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* --- UPLOADED RESOURCES SECTION --- */}
        <div className="dashboard-section mt-5">
          <h3 className="mb-4">Your Uploaded Resources</h3>
          <div className="row">
            {myUploads.length === 0 ? (
              <div className="col text-center"><p>You haven't uploaded any resources yet.</p><Link to="/upload" className="btn btn-success">Upload Your First File</Link></div>
            ) : (
              myUploads.map(resource => (
                <div className="col-lg-6 mb-4" key={resource._id}>
                  <ResourceCard 
                    resource={resource}
                    onDelete={handleDeleteResource}
                    showDeleteButton={true}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}