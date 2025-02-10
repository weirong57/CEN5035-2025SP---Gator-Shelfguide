import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in:', username, password);
    navigate('/mainlayout'); 
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signing up:', username, password);
    navigate('/mainlayout'); 
  };

  return (
    <div className="login-container">
      <div className="login-dialog">
        <h2>Gator Shelfguide</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
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
            placeholder="Enter password"
            required
          />
        </div>
        <div className="button-group">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
