import React from "react";
import { useFormik } from "formik";
import axios from "axios";   // axios import
import "../auth.css";

const Signup = () => {
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    onSubmit: async (values) => {
      try {
        // backend API call
        const res = await axios.post("http://localhost:5000/auth/signup", values);

        alert(res.data.message || "Signup successful!");
        console.log("Response:", res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Signup failed");
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
          <button type="submit">Signup</button>
        </form>
        <div className="auth-links">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
