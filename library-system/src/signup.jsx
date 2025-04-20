/*// Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Send a POST request to your backend endpoint
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          role: "user" // or allow user to choose if needed
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(errorText);
        return;
      }

      // Parse and handle success response
      const data = await response.json();
      alert(data.message); // e.g., "User registered successfully"

      // Navigate to login page after successful signup
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <h2>Create Your Account</h2>
          <p>Join Gator Shelfguide for a seamless library management experience.</p>
          {errorMessage && <div className="error">{errorMessage}</div>}
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Create a Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <span className="link" onClick={() => navigate("/login")}>
              Sign In
            </span>
          </p>
        </div>
        <div className="signup-right">
          <h2>Welcome to Gator Shelfguide</h2>
          <p>
            Access a world of library resources with one account. Manage your
            library effortlessly, track your favorite books, and discover new
            opportunities!
          </p>
          <button onClick={() => navigate("/login")}>Sign In Instead</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;*/
// src/signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset previous error messages
    setErrorMessage("");

    // Basic form validation
    if (!username || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      
      // Create the user object according to the User model in API documentation
      const userData = {
        username: username,
        password: password,
        role: "user" // Default role
      };

      // Send registration request to the proper endpoint
      const response = await axios.post("http://localhost:3000/api/register", userData);
      
      // API returns status 201 on success according to the docs
      message.success("Registration successful! Please log in now.");
      
      // Navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle different error responses based on API documentation
      if (err.response?.status === 400) {
        setErrorMessage(err.response.data?.message || "Invalid request. Please check your input.");
      } else if (err.response?.status === 500) {
        setErrorMessage("Server error. Please try again later.");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* LEFT SECTION – Signup Form */}
        <div className="signup-left">
          <h2>Create Your Account</h2>
          <p>Join Gator Shelfguide for a seamless library management experience.</p>
          {errorMessage && <div className="error">{errorMessage}</div>}
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Create a Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <p>
            Already have an account?{" "}
            <span className="link" onClick={() => navigate("/login")}>
              Sign In
            </span>
          </p>
        </div>

        {/* RIGHT SECTION – Visual / Info Panel */}
        <div className="signup-right">
          <h2>Welcome to Gator Shelfguide</h2>
          <p>
            Access a world of library resources with one account. Manage your
            library effortlessly, track your favorite books, and discover new
            opportunities!
          </p>
          <button onClick={() => navigate("/login")}>Sign In Instead</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;