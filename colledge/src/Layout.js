// src/Layout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        {/* The <Outlet> component will render the specific page component 
            (e.g., Home, Dashboard, etc.) based on the current route. */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}