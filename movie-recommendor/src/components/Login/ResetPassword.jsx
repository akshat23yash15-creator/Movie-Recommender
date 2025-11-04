import React, { useState } from "react";
import "./Login.css";
import { resetPassword } from "../../api/authService";

export default function ResetPassword({ onBack }) {
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Reset Password API
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
      setResetData({ email: "", newPassword: "" });
      onBack(); // go back to login after success
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reset password. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <button className="close-btn" onClick={onBack}>
        ←
      </button>
      <h2 className="modal-title">Reset Password</h2>
      <p className="modal-subtitle">
        Enter your registered email and a new password.
      </p>

      <form onSubmit={handleResetPassword} className="login-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Registered Email"
            value={resetData.email}
            onChange={(e) =>
              setResetData({ ...resetData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            value={resetData.newPassword}
            onChange={(e) =>
              setResetData({ ...resetData, newPassword: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="back-link" onClick={onBack}>
        ← Back to Login
      </p>
    </div>
  );
}
