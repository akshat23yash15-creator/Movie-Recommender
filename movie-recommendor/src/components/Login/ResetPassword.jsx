// src/components/Login/ResetPassword.jsx
import React, { useState } from "react";
import "./Login.css";
import { sendResetOtp, verifyAccount, resetPassword, verifyResetOtp } from "../../api/authService";

const ResetPassword = ({ onBack }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await sendResetOtp(email);
      if (res?.success) {
        alert("✅ OTP sent successfully! Check your email.");
        setStep("otp");
      } else {
        setErrorMsg(res?.message || "Email not found. Please check again.");
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      setErrorMsg("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const verifyResponse = await verifyResetOtp({ email, otp: Number(otp) });

      if (verifyResponse?.success) {
        alert("✅ OTP verified successfully!");
        setStep("reset");
      } else {
        setErrorMsg("❌ Invalid or expired OTP.");
      }
    } catch (err) {
      console.error("❌ Verification error:", err);
      setErrorMsg("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await resetPassword(email, newPassword);
      if (res?.success) {
        alert("🎉 Password reset successful! You can now log in.");
        onBack();
      } else {
        setErrorMsg(res?.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("❌ Password reset error:", err);
      setErrorMsg("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-modal">
      <h2>Reset Password</h2>

      {step === "email" && (
        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errorMsg && <p className="error-message">{errorMsg}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          <p className="back-link" onClick={onBack}>
            ← Back to Login
          </p>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {errorMsg && <p className="error-message">{errorMsg}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="back-link" onClick={() => setStep("email")}>
            ← Back
          </p>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {errorMsg && <p className="error-message">{errorMsg}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
