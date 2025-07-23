// src/Navbar.js
// Updated with a dropdown menu

import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { NavDropdown } from 'react-bootstrap'; // Import Dropdown
import "./Navbar.css";


export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem('token');
  const isAuthorized = token && user && (user.role === 'student' || user.role === 'staff');

  return (
    <nav className="navbar-custom">
      <h1 className="logo">
        <Link to={isAuthorized ? "/profile" : "/"} className="logo-link"><b>CollEdge</b></Link>
      </h1>
      <ul className="nav-links">
        <li><NavLink to="/Home">Home</NavLink></li>
        
        {isAuthorized && (
          <>
            {/* --- THIS IS THE NEW DROPDOWN --- */}
            <NavDropdown title="Share" id="share-dropdown">
              <NavDropdown.Item as={Link} to="/upload">Upload Resource</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/share-post">Post Info/Event</NavDropdown.Item>
            </NavDropdown>
            <li><NavLink to="/Dashboard">Dashboard</NavLink></li>
          </>
        )}
        
        <li><NavLink to="/Contact">Contact</NavLink></li>
        <li><NavLink to="/About">About</NavLink></li>

        {token && user ? (
          <li><NavLink to="/profile">👤 {user.name}</NavLink></li>
        ) : (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/">Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}