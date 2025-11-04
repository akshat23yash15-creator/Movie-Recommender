// src/api/authService.jsx
import axios from "axios";

const API_BASE_URL = "https://task-3-movie-recommender-1.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Handle all API errors in one place
const handleError = (error) => {
  console.error("❌ API Error:", error.response?.data || error.message);
  throw error.response?.data || { message: "Something went wrong" };
};

// 🧩 REGISTER USER
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/register", userData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧩 SEND OTP (after registration)
export const verifyOTP = async () => {
  try {
    console.log("📨 Calling /register/Verify-OTP to generate OTP");
    const res = await api.post("/register/Verify-OTP");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧩 VERIFY ACCOUNT (user enters OTP)
export const verifyAccount = async (otpData) => {
  try {
    console.log("🔍 Calling /register/Verify-account with", otpData);
    const res = await api.post("/register/Verify-account", otpData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧩 SEND RESET OTP
export const sendResetOtp = async (email) => {
  try {
    const res = await api.post("/send-reset-otp", { email });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧩 LOGIN
export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/login", credentials);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧩 FETCH USER DATA
export const getUserData = async () => {
  try {
    const res = await api.get("/user/data");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧩 LOGOUT
export const logoutUser = async () => {
  try {
    const res = await api.post("/logout");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// 🧩 RESET PASSWORD
export const resetPassword = async (email, newPassword) => {
  try {
    const res = await api.post("/reset-password", { email, newPassword });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
