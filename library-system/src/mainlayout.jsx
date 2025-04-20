/*
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

export default MainLayout;*/
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Layout, Spin, message } from 'antd';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import { useAuth } from './AuthContext';
import './App.css';

const { Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // 检查认证状态
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        message.warning('Please log in to access this page');
        navigate('/login', { 
          replace: true,
          state: { from: location } 
        });
        return;
      }

      try {
        // 如果用户是管理员，重定向到管理员页面
        if (user && user.role === 'admin' && !location.pathname.includes('/admin')) {
          navigate('/admin', { replace: true });
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Authentication error:', err);
        message.error('Session expired. Please log in again.');
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate, location, isAuthenticated, user]); 

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
      <Sidebar userRole={user?.role || 'user'} />
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