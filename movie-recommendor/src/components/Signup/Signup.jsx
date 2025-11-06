import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { registerUser, verifyOTP, verifyAccount } from "../../api/authService";

const Signup = () => {
  const [step, setStep] = useState("signup");
  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    try {
      const response = await registerUser({
        full_name: signupData.full_name,
        email: signupData.email,
        password: signupData.password,
      });

      if (response?.success) {
        alert("✅ Signup successful! OTP sent to your email.");
        await verifyOTP();
        setStep("verify");
      } else {
        setErrorMsg(response?.message || "Signup failed. Try again.");
      }
    } catch (err) {
      setErrorMsg("Signup failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const verifyResponse = await verifyAccount({ otp });
      if (verifyResponse?.success) {
        alert("🎉 Email verified successfully! Please log in now.");
        navigate("/login", { replace: true });
      } else {
        setErrorMsg("Invalid OTP or verification failed.");
      }
    } catch (err) {
      setErrorMsg("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="signup-modal">
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
              <button type="submit" disabled={loading} className="signup-btn"> 
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
            <p className="login-redirect">
              Already have an account?{" "}
              <span onClick={() => navigate("/login", { replace: true })}>
                Login
              </span>
            </p>
          </>
        )}

        {step === "verify" && (
          <>
            <h2>Verify OTP</h2>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {errorMsg && <p className="error-message">{errorMsg}</p>}
              <button type="submit" disabled={loading} className="verify-btn">
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
