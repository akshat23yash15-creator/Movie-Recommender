import React, { useState } from "react";
import "./Signup.css";

const Signup = ({ onClose }) => {
  const [step, setStep] = useState("signup"); // "signup" | "verify"
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");

  // 🧩 Handle Signup
  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("📝 Sending signup request for:", signupData);

    // TODO: integrate backend signup API here
    // Example: await axios.post("/auth/signup", signupData);

    alert("✅ Signup request successful! OTP sent to your email.");
    setStep("verify");
  };

  // 🧩 Handle OTP Verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    console.log("🔍 Verifying OTP:", otp);

    // TODO: integrate /auth/verify-otp API here
    alert("✅ OTP verified! Account successfully created.");

    setStep("signup");
    setSignupData({ name: "", email: "", password: "", confirmPassword: "" });
    setOtp("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="signup-modal">
        <button className="close-btn" onClick={onClose}>✖</button>

        {/* 🔹 SIGNUP FORM */}
        {step === "signup" && (
          <>
            <h2>Create Account</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
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

              <button type="submit" className="signup-btn">Sign Up</button>
            </form>

            <p className="login-redirect">
              Already have an account? <span onClick={onClose}>Login</span>
            </p>
          </>
        )}

        {/* 🔹 OTP VERIFICATION */}
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
              <button type="submit" className="verify-btn">Verify OTP</button>
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
