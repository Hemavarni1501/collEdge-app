// src/index.js
// Final version with a multi-level protection scheme.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';
import SharePost from './SharePost.js'; 
import ForgotPassword from './ForgotPassword.js';


// --- Import Layouts ---
import Layout from './Layout.js';
import AuthLayout from './AuthLayout.js';

// --- Import Page Components ---
import WRU from './WRU.js';
import Register from './Register.js';
import Visitor from './Visitor.js';
import Login from './Login.js';
import HomePage from './Home.js';
import UploadPage from './Upload.js';
import Dashboard from './Dashboard.js';
import ContactPage from './Contact.js';
import AboutPage from './About.js';
import SearchResource from './SearchResources.js';
import Profile from "./Profile";
import ProtectedRoute from './ProtectedRoute.js';
import reportWebVitals from './reportWebVitals';

// Simple 404 Not Found component
function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1 style={{ fontSize: '4rem', color: '#00c4ff' }}>404</h1>
      <p className="text-light mt-3">Oops! The page you're looking for doesn't exist.</p>
      <a href="/home" className="btn btn-neon mt-3">Go to Home</a>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* --- Group 1: Authentication Routes (No Navbar/Footer) --- */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<WRU />} />
          <Route path="/register/:role" element={<Register />} />
          <Route path="/visitor" element={<Visitor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* --- Group 2: Main Application Routes (With Navbar/Footer) --- */}
        <Route element={<Layout />}>
          {/* Publicly accessible pages */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchResource />} />

          {/* --- Sub-Group A: Protected for ANY Logged-In User --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* --- Sub-Group B: Protected for SPECIFIC Roles --- */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'staff']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/share-post" element={<SharePost />} />
          </Route>

          {/* --- 404 Catch-All Route --- */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();