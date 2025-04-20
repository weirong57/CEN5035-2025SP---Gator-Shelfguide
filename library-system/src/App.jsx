/*
// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import MainLayout from './mainLayout';
import { Dashboard, BookManagement, UserCenter, Reports } from './pages';
import AdminDashboard from './pages/AdminDashboard';
import BookReviews from './pages/BookReviews';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/admin" element={<AdminDashboard />} />
      

      <Route path="/main" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="users" element={<UserCenter />} />
        <Route path="reviews" element={<BookReviews />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;*/
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import MainLayout from './mainLayout';
import { Dashboard, BookManagement, UserCenter, Reports } from './pages';
import AdminDashboard from './pages/AdminDashboard';
import BookReviews from './pages/BookReviews';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* 管理员路由 */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      
      {/* 受保护的路由 */}
      <Route path="/main" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="users" element={<UserCenter />} />
        <Route path="reviews" element={<BookReviews />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
