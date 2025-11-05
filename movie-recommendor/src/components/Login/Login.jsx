// src/components/Login/Login.jsx
import React, { useState } from "react";
import "./Login.css";
import { loginUser } from "../../api/authService";
import ResetPassword from "./ResetPassword";

const Login = ({ onClose, onSignupClick, onProfileClick }) => {
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({
        email: loginData.email,
        password: loginData.password,
      });

      if (res?.success) {
        alert("✅ Login successful!");
        console.log("User logged in:", res);
        onClose();
        // 👇 automatically open the Profile modal after login
        setTimeout(() => {
          onProfileClick();
        }, 300);
      } else {
        alert(res?.message || "❌ Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotClick = () => setShowReset(true);

  return (
    <div className="login-modal">
      {!showReset ? (
        <div className="login-card">
          <button className="close-btn" onClick={onClose}>✖</button>

          <h2 className="modal-title">Login</h2>
          <p className="modal-subtitle">Welcome back! Please log in.</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="forgot-link" onClick={handleForgotClick}>
            Forgot Password?
          </p>

          <p className="signup-text">
            Don’t have an account?{" "}
            <span
              onClick={() => {
                onClose();
                onSignupClick();
              }}
            >
              Sign Up
            </span>
          </p>
        </div>
      ) : (
        <ResetPassword onBack={() => setShowReset(false)} />
      )}
    </div>
  );
};

export default Login;
