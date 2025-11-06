import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../../api/authService";
import ResetPassword from "./ResetPassword";

const Login = ({ onLoginSuccess }) => {
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

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

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          localStorage.setItem("isAuthenticated", "true");
          navigate("/", { replace: true });
        }
      } else {
        alert(res?.message || "❌ Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      {!showReset ? (
        <div className="login-card">
          <h2 className="modal-title">Login</h2>
          <p className="modal-subtitle">Welcome back! Please log in.</p>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="forgot-link" onClick={() => setShowReset(true)}>
            Forgot Password?
          </p>

          <p className="signup-text">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
        </div>
      ) : (
        <ResetPassword onBack={() => setShowReset(false)} />
      )}
    </div>
  );
};

export default Login;
