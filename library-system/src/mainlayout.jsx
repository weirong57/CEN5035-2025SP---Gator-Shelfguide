/*// MainLayout.js
import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import './App.css';

const { Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn && !location.pathname.startsWith('/login')) {
      navigate('/login', { 
        replace: true,
        state: { from: location } 
      });
    }
  }, [navigate, location]); 
  /*useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: location } });
        return;
      }

      try {
        const res = await axios.get('/api/auth/verify');
        if (res.data.role !== 'user') {
          throw new Error('Invalid role');
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAuth();
  }, []);//

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw', background: '#f0f2f5' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;*/
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Layout, Spin, message } from 'antd';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import apiClient from './api/client';
import './App.css';

const { Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('authToken');
      
      if (!isLoggedIn || !token) {
        navigate('/login', { 
          replace: true,
          state: { from: location } 
        });
        return;
      }

      try {
        // Optional: verify token with backend if needed
        // In production, you should implement a real token verification
        // For now, we'll just check if token exists
        
        // Get user role from local storage
        const savedRole = localStorage.getItem('userRole');
        setUserRole(savedRole || 'user');
        
        // If user is admin, redirect to admin dashboard
        if (savedRole === 'admin' && !location.pathname.includes('/admin')) {
          navigate('/admin', { replace: true });
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Authentication error:', err);
        message.error('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate, location]); 

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw', background: '#f0f2f5' }}>
      <Sidebar userRole={userRole} />
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;