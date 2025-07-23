// src/Footer.js
// Updated with a clickable logo that navigates home

import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  // Determine if a user is logged in to decide the home link destination
  const token = localStorage.getItem('token');
  const homePath = token ? '/home' : '/'; // Go to dashboard if logged in, else landing page

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          
          {/* Column 1: About the Site */}
          <div className="footer-column about">
            {/* --- THIS IS THE CHANGE --- */}
            <Link to={homePath} className="footer-logo-link">
              <h3>CollEdge</h3>
            </Link>
            <p className="footer-about-text">
              Your central hub for sharing and discovering academic resources. Built for students, by students.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/About">About Us</Link></li>
              <li><Link to="/Contact">Contact</Link></li>
              <li><Link to="/Home">Search Resources</Link></li>
            </ul>
          </div>

          {/* Column 3: Social & Contact */}
          <div className="footer-column social">
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a href="mailto:support@colledge.com" aria-label="Email" title="support@colledge.com">
                <FaEnvelope />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/in/hemavarni-sivakumar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

        </div>
      </div>
      <div className="footer-bottom-bar">
        <p>© {new Date().getFullYear()} CollEdge. All Rights Reserved.</p>
      </div>
    </footer>
  );
}