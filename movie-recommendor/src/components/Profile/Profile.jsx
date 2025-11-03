// src/components/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";
import { getUserData, logoutUser } from "../../api/authService";

const Profile = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser({ name: "Guest", email: "guest@roovie.com" });
      return;
    }

    getUserData(token)
      .then((data) => setUser(data))
      .catch(() => {
        setUser({ name: "Guest", email: "guest@roovie.com" });
      });
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) await logoutUser(token);
    localStorage.clear();
    onClose();
  };

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="profile-title gradient-text">My Profile</h2>

        <div className="profile-content">
          <div className="profile-avatar">👤</div>

          <div className="profile-field">
            <label>Name:</label>
            <p>{user?.name}</p>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <p>{user?.email}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
