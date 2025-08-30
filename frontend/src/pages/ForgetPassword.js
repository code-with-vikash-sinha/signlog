import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha"; 
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "../auth.css";

const ForgotPassword = () => {
  const [captchaToken, setCaptchaToken] = useState(null);

  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: async (values) => {
      if (!captchaToken) {
        toast.warning("⚠️ Please complete the reCAPTCHA"); // ✅ alert ki jagah toast
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/auth/forgot-password", {
          email: values.email,
          captcha: captchaToken, 
        });

        toast.success(response.data.message); // ✅ success notification
      } catch (error) {
        console.error("Error sending reset link:", error);
        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong");
        } else {
          toast.error("Network error. Try again.");
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

          {/* ✅ Google reCAPTCHA */}
          <ReCAPTCHA
            sitekey="6LfjibArAAAAALCy8yOKjcVoAmlbQRBEkki3Vc6P" 
            onChange={(token) => setCaptchaToken(token)}
          />

          <button type="submit">Send Reset Link</button>
        </form>
        <div className="auth-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgotPassword;
