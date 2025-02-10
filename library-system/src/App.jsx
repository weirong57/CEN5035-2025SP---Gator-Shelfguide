import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';          // Login component
import MainLayout from './mainlayout'; // Main layout for the app (after login)

function App() {
  return (

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/mainlayout" element={<MainLayout />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
  
  );
}

export default App;
