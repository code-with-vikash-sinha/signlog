import React from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 combine imports
import { useFormik } from "formik";
import axios from "axios";
import "../auth.css";

const Login = () => {
  const navigate = useNavigate(); // 👈 hook must be inside component

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://localhost:5000/auth/login", values);
        alert(res.data.message);

        // backend se user data save kar sakte ho localStorage me
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // login success hone par welcome page pe redirect
        navigate("/welcome");
      } catch (err) {
        if (err.response) {
          alert(err.response.data.error || "Login failed");
        } else {
          alert("Server error");
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
