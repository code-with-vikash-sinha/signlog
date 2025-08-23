import React from "react";
import { useNavigate } from "react-router-dom";
import "../auth.css";

const Welcome = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // login user data

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login"); // logout ke baad login page
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Welcome, {user?.name || "Buddy"}!</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Welcome;
