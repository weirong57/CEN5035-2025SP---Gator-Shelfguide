import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle username/password login
  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert('Please enter your username and password.');
      return;
    }

    // TODO: Replace with your actual authentication logic
    console.log('Username login:', username, password);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/main/dashboard');
  };

  // Navigate to signup page
  const handleSignup = () => {
    navigate('/signup');
  };

  // Placeholder for social login
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* LEFT COLUMN */}
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
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit">Login</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN (Gradient Sidebar) */}
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
