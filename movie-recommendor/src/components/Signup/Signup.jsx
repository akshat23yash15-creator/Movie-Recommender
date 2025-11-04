// src/components/Signup/Signup.jsx
import React, { useState } from "react";
import "./Signup.css";
import { registerUser, verifyOTP, verifyAccount } from "../../api/authService";

const Signup = ({ onClose }) => {
  const [step, setStep] = useState("signup"); // signup | verify
  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🧩 Step 1 — Handle Registration
  const handleSignup = async (e) => {
    e.preventDefault();

    // validate passwords
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      console.log("📝 Sending signup request:", signupData);

      const response = await registerUser({
        full_name: signupData.full_name,
        email: signupData.email,
        password: signupData.password,
      });

      console.log("✅ Backend response:", response);

      if (response?.success) {
        alert(response.message || "Signup successful! Generating OTP...");
        // Step 2 — ask backend to send OTP
        const otpResponse = await verifyOTP();
        console.log("📩 OTP email triggered:", otpResponse);
        alert(otpResponse.message || "OTP sent to your email. Please verify.");
        setStep("verify");
      } else {
        setErrorMsg(response?.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setErrorMsg(err.message || "Signup failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Step 3 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔍 Verifying OTP:", otp);

      const verifyResponse = await verifyAccount({ otp }); // ✅ pass otp object
      console.log("✅ Account verification response:", verifyResponse);

      if (verifyResponse?.success) {
        alert("🎉 Email verified successfully! You can now log in.");
        setStep("signup");
        setSignupData({
          full_name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setOtp("");
        onClose();
      } else {
        setErrorMsg(verifyResponse?.message || "Invalid OTP or verification failed.");
      }
    } catch (err) {
      console.error("❌ Verification error:", err);
      setErrorMsg(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🧱 UI
  return (
    <div className="modal-overlay">
      <div className="signup-modal">
        <button className="close-btn" onClick={onClose}>✖</button>

        {step === "signup" && (
          <>
            <h2>Create Account</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.full_name}
                onChange={(e) =>
                  setSignupData({ ...signupData, full_name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />

              {errorMsg && <p className="error-message">{errorMsg}</p>}

              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
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
              {errorMsg && <p className="error-message">{errorMsg}</p>}
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
