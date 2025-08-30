// src/pages/Signup.js
import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";  
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "../auth.css";

const Signup = () => {
  const [captchaToken, setCaptchaToken] = useState(null);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    onSubmit: async (values) => {
      if (!captchaToken) {
        toast.warning("⚠️ Please verify captcha"); // ✅ alert ki jagah toast
        return;
      }

      try {
        const res = await axios.post("http://localhost:5000/auth/signup", {
          ...values,
          captcha: captchaToken,
        });

        toast.success(res.data.message || "Signup successful!"); // ✅ success toast
        console.log("Response:", res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || "Signup failed"); // ✅ error toast
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />

          {/* ✅ Google reCAPTCHA */}
          <ReCAPTCHA
            sitekey="6LfjibArAAAAALCy8yOKjcVoAmlbQRBEkki3Vc6P" 
            onChange={(token) => setCaptchaToken(token)}
          />

          <button type="submit">Signup</button>
        </form>
        <div className="auth-links">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;
