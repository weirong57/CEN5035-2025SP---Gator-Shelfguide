// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

// 创建认证上下文
const AuthContext = createContext(null);

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 解析 JWT 令牌获取用户信息
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      console.log('JWT 负载解析结果:', payload);
      return payload;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  };

  // 组件挂载时初始化认证状态
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        // 解析令牌获取用户信息
        const payload = parseJwt(token);
        
        if (payload) {
          // 检查令牌是否过期
          const currentTime = Date.now() / 1000;
          if (payload.exp && payload.exp < currentTime) {
            // 令牌已过期
            logout();
            message.warning('Your session has expired. Please log in again.');
            setLoading(false);
            return;
          }
          
          // 在这里确保用户ID正确设置
          // 从payload中读取userId或UserID字段
          const userId = payload.userId || payload.UserID || payload.userID || null;
          
          // 如果解析出用户ID，存储到localStorage
          if (userId) {
            localStorage.setItem('userId', userId);
          } else {
            // 如果JWT中没有用户ID，尝试从localStorage获取
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
              // 如果本地存储也没有，设置一个默认值（仅用于测试）
              localStorage.setItem('userId', '1');
              console.warn('未找到用户ID，设置为默认值1');
            }
          }
          
          // 设置用户状态，确保id字段存在
          setUser({
            id: userId || localStorage.getItem('userId'),
            role: payload.Role || payload.role || localStorage.getItem('userRole') || 'user',
            username: localStorage.getItem('username') || 'User'
          });
          
          console.log('设置的用户状态:', {
            id: userId || localStorage.getItem('userId'),
            role: payload.Role || payload.role || localStorage.getItem('userRole'),
            username: localStorage.getItem('username') || 'User'
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // 登录函数
  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials);
      
      const data = response.data;
      
      if (!data.token) {
        throw new Error('No token received from server');
      }
      
      // 将认证数据存储在 localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      
      // 解析令牌获取用户信息
      const payload = parseJwt(data.token);
      
      // 设置默认用户ID（临时解决方案）
      localStorage.setItem('userId', '1');
      
      if (payload) {
        const userId = payload.userId || payload.UserID || payload.userID || '1';
        localStorage.setItem('userId', userId);
        
        if (payload.Role || payload.role) {
          localStorage.setItem('userRole', payload.Role || payload.role);
        }
      }
      
      // 设置用户状态
      setUser({
        id: payload?.userId || payload?.UserID || payload?.userID || localStorage.getItem('userId') || '1',
        role: payload?.Role || payload?.role || data.role || 'user',
        username: data.username || credentials.username || 'User'
      });
      
      return { success: true, role: payload?.Role || payload?.role || data.role };
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error;
    }
  };

  // 注销函数
  const logout = () => {
    // 清除 localStorage 中的认证数据
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    
    // 重置用户状态
    setUser(null);
  };

  // 检查用户是否已认证
  const isAuthenticated = () => {
    return !!user;
  };

  // 获取当前用户
  const getCurrentUser = () => {
    return user;
  };

  // 上下文值
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    getCurrentUser
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

// 自定义钩子以使用认证上下文
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 确保导出所有需要的内容
export { useAuth };