// src/AuthLayout.js
// A minimal layout for registration and login pages.

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    // This div ensures the page still has your theme's background color.
    // You can add a class here if you have a specific background style.
    <div className="auth-page-container">
      <main>
        {/* The Outlet will render the Login, Register, or WRU component */}
        <Outlet />
      </main>
    </div>
  );
}