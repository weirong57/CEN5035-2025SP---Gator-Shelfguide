import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spin } from 'antd';

// 受保护的路由组件，未认证时重定向到登录页面
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 认证检查时显示加载状态
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

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要特定角色且用户没有该角色，重定向到未授权页面
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 如果已认证且拥有所需角色（如果有的话），渲染子组件
  return children;
};

// 管理员路由组件，要求管理员角色
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

// 未授权页面
export const UnauthorizedPage = () => {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>访问被拒绝</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '500px' }}>
        您没有访问此页面的权限。如果您认为这是错误，请联系管理员。
      </p>
      <button 
        onClick={() => window.history.back()} 
        style={{
          marginTop: '2rem',
          padding: '10px 20px',
          fontSize: '1rem',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        返回上一页
      </button>
    </div>
  );
};