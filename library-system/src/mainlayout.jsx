// MainLayout.js
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
  }, []);*/

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

export default MainLayout;