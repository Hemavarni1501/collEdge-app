// src/ProtectedRoute.js
// Upgraded to be more flexible and handle different authorization levels.

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// The component now accepts a prop: an array of roles that are allowed to access the route.
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. First, check if the user is logged in at all.
  if (!token || !user) {
    // If no token, they are not logged in. Redirect to the login page.
    return <Navigate to="/login" replace />;
  }

  // 2. If they are logged in, check if this route requires specific roles.
  //    - If `allowedRoles` is provided, check if the user's role is in the list.
  //    - If `allowedRoles` is NOT provided, it means any logged-in user is allowed.
  const isAuthorized = allowedRoles ? allowedRoles.includes(user.role) : true;

  // 3. Render the page if they are authorized, otherwise redirect them.
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;