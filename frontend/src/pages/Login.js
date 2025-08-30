import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha"; 
import { ToastContainer, toast } from "react-toastify"; // ✅ toast import
import "react-toastify/dist/ReactToastify.css"; 
import "../auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      if (!captchaToken) {
        toast.warning("⚠️ Please verify captcha!"); // ✅ warning toast
        return;
      }

      try {
        const res = await axios.post("http://localhost:5000/auth/login", {
          ...values,
          captcha: captchaToken,
        });

        toast.success(res.data.message); // ✅ success toast

        localStorage.setItem("user", JSON.stringify(res.data.user));

        // thoda delay tak toast dikhane ke liye
        setTimeout(() => navigate("/welcome"), 1500);
      } catch (err) {
        if (err.response) {
          toast.error(err.response.data.error || "Login failed"); // ❌ error toast
        } else {
          toast.error("Server error");
        }
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
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

          <button type="submit">Login</button>
        </form>

        <p>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;


