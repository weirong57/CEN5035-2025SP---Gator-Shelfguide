// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainLayout from './MainLayout';
import { Dashboard, BookManagement, UserCenter, Reports } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/main" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="users" element={<UserCenter />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;