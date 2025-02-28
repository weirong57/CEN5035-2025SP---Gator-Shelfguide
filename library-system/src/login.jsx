// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (type) => (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      alert('Please login with your username and password.');
      return;
    }

    console.log(`${type}:`, username, password);
    localStorage.setItem('isLoggedIn', 'true');
    
    navigate('/main/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-dialog">
        <h2>Gator Shelfguide</h2>
        <form onSubmit={handleSubmit('Login')}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Login with username."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Login with password."
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">Login</button>
            <button 
              type="button"
              onClick={handleSubmit('Signup')}
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;