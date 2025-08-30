import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../welcome.css";

const Welcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false); // sidebar toggle state

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="welcome-container">
      {/* Toggle Button */}
      <button
        className="toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar Navbar */}
      <div className={`welcome-sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="welcome-logo">MyApp</h2>
        <ul>
          <li onClick={() => navigate("/home")}>🏠 Home</li>
          <li onClick={() => navigate("/about")}>ℹ️ About</li>
          <li onClick={() => navigate("/contact")}>📞 Contact</li>
          <li onClick={() => navigate("/profile")}>👤 Profile</li>
          <li onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="welcome-content">
        <div className="welcome-box">
          <h1>Welcome, {user?.name || "Buddy"} 👋</h1>
          <p>You have successfully logged in.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

