import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';          // Login component
import MainLayout from './mainlayout'; // Main layout for the app (after login)

function App() {
  return (
    <Routes>
      {/* Public Route for Authentication */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/*" element={<MainLayout />} />

      {/* Redirect any unknown routes to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
