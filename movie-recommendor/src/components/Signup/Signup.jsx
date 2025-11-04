import React, { useState } from "react";
import "./Signup.css";
import { registerUser, verifyOTP, verifyAccount, sendResetOtp } from "../../api/authService";

const Signup = ({ onClose }) => {
  const [step, setStep] = useState("signup");
  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    // Instead of alert, set error message
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      console.log(" Sending signup request:", signupData);

      const response = await registerUser({
        full_name: signupData.full_name || signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      console.log(" Backend response:", response);

      if (response?.token) {
        setToken(response.token);
        try {
          localStorage.setItem("verifyToken", response.token);
        } catch (e) { }
        console.log(" Stored token:", response.token);
      }

      alert(response.message || "Signup successful! OTP sent to your email.");
      setStep("verify");
      handleVerifyOtp();
    } catch (err) {
      console.error("❌ Signup error:", err);
      setErrorMsg(err.message || "Signup failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.();

    const effectiveToken = token ||
      (() => {
        try {
          return localStorage.getItem("verifyToken");
        } catch (e) {
          return null;
        }
      })();

    setLoading(true);
    try {
      console.log("🔎 verifyOtp called, token(fallback):", effectiveToken, "otp:", otp);

      const otpResponse = await verifyOTP();
      console.log("OTP verified:", otpResponse);

      const verifyResponse = await verifyAccount();
      console.log("Account verified:", verifyResponse);

      const sendOtpResponse = await sendResetOtp(signupData.email);
      console.log(" OTP email sent:", sendOtpResponse);

      alert("Account verified and OTP sent to your email!");

      setStep("signup");
      setSignupData({ name: "", email: "", password: "", confirmPassword: "" });
      setOtp("");
      onClose();
    } catch (err) {
      console.error("❌ Verification flow error:", err);
      setErrorMsg(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="signup-modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {step === "signup" && (
          <>
            <h2>Create Account</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({ ...signupData, confirmPassword: e.target.value })
                }
                required
              />

              {/* ✅ Inline error message */}
              {errorMsg && <p className="error-message">{errorMsg}</p>}

              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Send OTP"}
              </button>
            </form>

            <p className="login-redirect">
              Already have an account? <span onClick={onClose}>Login</span>
            </p>
          </>
        )}

        {step === "verify" && (
          <>
            <h2>Verify OTP</h2>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="verify-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
            <p className="back-link" onClick={() => setStep("signup")}>
              ← Back to Signup
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
