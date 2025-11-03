import React, { useState } from "react";
import "./Login.css";
import { loginUser, resetPassword } from "../../api/authService"; // ✅ make sure this path is correct

const Login = ({ onClose }) => {
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // 🔹 Reset password state
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
  });

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(loginData.email, loginData.password);
      alert("✅ Login successful!");
      console.log("User:", res);
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Forgot Password → Reset API
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetData.email || !resetData.newPassword) {
      alert("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(resetData.email, resetData.newPassword);
      alert("✅ Password reset successfully!");
      console.log("Reset Response:", res);
      setIsForgot(false);
      setResetData({ email: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reset password. Check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* LOGIN FORM */}
        {!isForgot ? (
          <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p
              className="forgot-link"
              onClick={() => setIsForgot(true)}
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <>
            {/* RESET PASSWORD FORM */}
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={resetData.email}
                onChange={(e) =>
                  setResetData({ ...resetData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={resetData.newPassword}
                onChange={(e) =>
                  setResetData({ ...resetData, newPassword: e.target.value })
                }
                required
              />

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <p
              className="back-link"
              onClick={() => setIsForgot(false)}
            >
              ← Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
