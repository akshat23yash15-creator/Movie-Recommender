import React, { useState } from "react";
import "./Login.css";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });

    // Simulate login
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "User", email, joined: "01 Nov 2025" })
    );

    onClose();
  };

  return (
    <div className="login-modal">
      <div className="login-card">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2 className="modal-title">Welcome Back</h2>
        <p className="modal-subtitle">Login to continue your journey 🎬</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <span>Sign up now</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
