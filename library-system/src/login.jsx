
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import './Login.css';
import { useAuth } from './AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  // Handle username/password login
  /*const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      message.error('Please enter your username and password.');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting login with:', { username }); // 不记录密码
      
      // 发送登录请求
      const response = await axios.post('/api/login', {
        username,
        password
      });
      
      // 记录响应内容，帮助调试
      console.log('Login response:', response.data);
      
      // 检查响应中是否有token
      if (response.data && response.data.token) {
        // 存储认证信息
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        
        // 存储用户角色
        if (response.data.role) {
          localStorage.setItem('userRole', response.data.role);
        }
        
        message.success('Login successful!');
        console.log('Login successful, navigating to dashboard');
        
        // 根据角色重定向
        const role = response.data.role || 'user';
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/main/dashboard');
        }
      } else {
        // 服务器响应但没有token
        console.error('Login failed: No token in response', response.data);
        message.error('Login failed. Server response missing token.');
      }
    } catch (error) {
      // 详细记录错误信息
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // 根据错误状态码显示不同信息
      if (error.response?.status === 401) {
        message.error('Invalid username or password');
      } else if (error.response?.status === 400) {
        message.error('Invalid request. Please check your input.');
      } else {
        message.error(`Login failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };*/
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      message.error('Please enter your username and password.');
      return;
    }

    try {
      setLoading(true);
      
      // 使用认证上下文的login函数
      const result = await login({ username, password });
      
      message.success('Login successful!');
      
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/main/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid username or password')) {
        message.error('Invalid username or password');
      } else if (error.message.includes('Invalid request')) {
        message.error('Invalid request. Please check your input.');
      } else {
        message.error(`Login failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  // 导航到注册页面
  const handleSignup = () => {
    navigate('/signup');
  };

  // 社交登录占位符
  const handleSocialLogin = (provider) => {
    message.info(`${provider} login is not implemented yet.`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="left-content">
            <div className="logo">Gator Shelfguide</div>
            <p>Login using social networks</p>
            <div className="social-login">
              <button
                className="social-button"
                onClick={() => handleSocialLogin('Gmail')}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
                  alt="Gmail"
                  width="20"
                  height="20"
                />
              </button>
              <button
                className="social-button"
                onClick={() => handleSocialLogin('Outlook')}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/76/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
                  alt="Outlook"
                  width="20"
                  height="20"
                />
              </button>
            </div>

            <div className="or-divider">OR</div>

            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>

        <div className="login-right">
          <div className="signup-box">
            <h2>New Here?</h2>
            <p>
              Sign up and discover the Elibrary!
            </p>
            <button onClick={handleSignup}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;