/*import { Layout, Dropdown, Space, Avatar } from 'antd'
import { UserOutlined, DownOutlined } from '@ant-design/icons'

const { Header } = Layout

export default function AppHeader() {
  return (
    <Header style={{ 
      background: '#fff',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}>
      <Dropdown
        menu={{
          items: [
            { key: 'profile', label: 'Personal center' },
            { key: 'logout', label: 'Logout' }
          ]
        }}
      >
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <span>Admin</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </Header>
  )
}*/
// src/components/Layout/Header.jsx
import { useState, useEffect } from 'react';
import { Layout, Dropdown, Space, Avatar, message } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('User');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Get the username from local storage or state management
    // For now, we'll use a placeholder
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole || 'user');
  }, []);

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/main/users');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    try {
      // Clear all authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      
      // Show success message
      message.success('Logged out successfully');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Logout failed');
    }
  };

  const menuItems = [
    { key: 'profile', label: 'Personal Center' },
    { key: 'logout', label: 'Logout' }
  ];

  return (
    <Header style={{ 
      background: '#fff',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div className="header-title">
        <h3>Gator Shelfguide Library</h3>
      </div>
      
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick
        }}
      >
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <span>{role === 'admin' ? 'Admin' : username}</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </Header>
  );
}