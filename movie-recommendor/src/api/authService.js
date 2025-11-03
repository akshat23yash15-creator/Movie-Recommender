
import axios from "axios";

const API_BASE_URL = "https://task-3-movie-recommender-1.onrender.com/api";

// Helper to handle errors
const handleError = (error) => {
  console.error("❌ API Error:", error.response?.data || error.message);
  throw error.response?.data || { message: "Something went wrong" };
};

// REGISTER USER
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/register`, userData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// VERIFY OTP
export const verifyOTP = async (otpData, token) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/register/Verify-OTP`, otpData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// LOGIN USER
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, credentials);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// FETCH USER DATA (requires token)
export const getUserData = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// LOGOUT
export const logoutUser = async (token) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
