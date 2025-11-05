// src/components/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";
import { getUserData, logoutUser } from "../../api/authService";

const Profile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        console.log("✅ User data fetched:", data);

        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          setErrorMsg("User data not found. Please log in again.");
          setUser({ full_name: "Guest", email: "guest@roovie.com" });
        }
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        setErrorMsg("Failed to load profile. Please log in again.");
        setUser({ full_name: "Guest", email: "guest@roovie.com" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("You have been logged out successfully!");
      onClose();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Something went wrong during logout.");
    }
  };

  if (loading) {
    return (
      <div className="profile-overlay">
        <div className="profile-modal">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2 className="profile-title gradient-text">My Profile</h2>

        <div className="profile-content">
          <div className="profile-avatar">👤</div>

          {errorMsg && <p className="error-message">{errorMsg}</p>}

          <div className="profile-field">
            <label>Name:</label>
            <p>{user?.full_name || "Guest"}</p>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <p>{user?.email || "guest@roovie.com"}</p>
          </div>

          <div className="profile-field">
            <label>Verified:</label>
            <p>{user?.isVerified ? "✅ Yes" : "❌ No"}</p>
          </div>

          <div className="profile-field">
            <label>Joined:</label>
            <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default Profile;
