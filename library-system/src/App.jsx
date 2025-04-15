// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';       // Two-column Login page
import Signup from './signup';     // New Signup page for Gator Shelfguide
import MainLayout from './mainLayout';
import { Dashboard, BookManagement, UserCenter, Reports } from './pages';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* Redirect root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminDashboard />} />
      {/* Main layout after login */}
      <Route path="/main" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="users" element={<UserCenter />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      {/* Catch-all redirects to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
