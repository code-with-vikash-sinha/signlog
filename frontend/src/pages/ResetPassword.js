import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../auth.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Token query parameter from URL
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage("Please enter new password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
        <div className="auth-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

