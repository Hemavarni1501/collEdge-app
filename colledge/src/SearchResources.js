// src/SearchResources.js
// Updated to use the new ResourceCard component

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ResourceCard from './ResourceCard'; // Import our new component

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const isAuthorizedToAdd = token && user && (user.role === 'student' || user.role === 'staff');

  // Function to add an item to the dashboard
  const handleAddToDashboard = async (resourceId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to your dashboard.');
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      // Call the correct backend endpoint
      await axios.post('https://colledge-backend.onrender.com/api/dashboard/save', { resourceId }, config);
      alert('Resource added to your dashboard!');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to dashboard.';
      alert(message);
    }
  };

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div>
      <div className="container mt-5">
        <h2 className="mb-4">Search Results for "{query}"</h2>
        <div className="row">
          {loading ? (
            <p>Searching...</p>
          ) : results.length > 0 ? (
            results.map((resource) => (
              <div className="col-lg-6 mb-4" key={resource._id}>
                <ResourceCard 
                  resource={resource}
                  onAddToDashboard={handleAddToDashboard}
                  showAddButton={isAuthorizedToAdd} // Tell the card to show the "Add" button
                />
              </div>
            ))
          ) : (
            <p>No results found for your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}