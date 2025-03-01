// Signup.jsx
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
      const response = await fetch("http://localhost:3000/register", {
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
