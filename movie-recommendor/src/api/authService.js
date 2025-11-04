import axios from "axios";

const API_BASE_URL = "https://task-3-movie-recommender-1.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  throw error.response?.data || { message: "Something went wrong" };
};

export const registerUser = async (userData) => {
  try {
    const res = await api.post("/register", userData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyOTP = async (otpData) => {
  try {
    console.log("authService.verifyOTP called", otpData);
    const res = await api.post("/register/Verify-OTP", otpData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const verifyAccount = async () => {
  try {
    const res = await api.post("/register/Verify-account");
    return res.data;
  } catch (error) {
    console.error("❌ Verify account error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Account verification failed" };
  }
};

export const sendResetOtp = async (email) => {
  try {
    const res = await api.post("/send-reset-otp", { email });
    return res.data;
  } catch (error) {
    console.error(" Send OTP error:", error.response?.data || error.message);
    throw error.response?.data || { message: "OTP send failed" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/login", credentials);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserData = async () => {
  try {
    const res = await api.get("/data");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    const res = await api.post("/logout");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const res = await api.post("/reset-password", { email, newPassword });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
