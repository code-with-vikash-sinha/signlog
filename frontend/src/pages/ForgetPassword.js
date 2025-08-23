import React from "react";
import { useFormik } from "formik";
import axios from "axios";  // axios import
import "../auth.css";

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: async (values) => {
      try {
        // backend call
        const response = await axios.post("http://localhost:5000/auth/forgot-password", {
          email: values.email,
        });

        alert(response.data.message); // backend se aaya message show karega
      } catch (error) {
        console.error("Error sending reset link:", error);
        if (error.response) {
          alert(error.response.data.message || "Something went wrong");
        } else {
          alert("Network error. Try again.");
        }
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <button type="submit">Send Reset Link</button>
        </form>
        <div className="auth-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

