const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const crypto = require("crypto"); 
const transporter = require("../config/mail");
const router = express.Router();
const axios = require("axios");
// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
  const { name, email, password, captcha } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!captcha) {
    return res.status(400).json({ error: "Captcha is required" });
  }

  try {
    // ✅ Step 1: Verify captcha with Google
    const captchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LfjibArAAAAAFSMBtMBoYiOhV6V__qUlxsXm3d_&response=${captcha}`
    );

    if (!captchaVerify.data.success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    // ✅ Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Step 3: Save user in DB
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already exists" });
          }
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully!" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
    const { email, password, captcha } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    if (!captcha) {
        return res.status(400).json({ error: "Captcha is required" });
    }

    try {
        // ✅ Captcha verify karo
        const captchaVerify = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=6LfjibArAAAAAFSMBtMBoYiOhV6V__qUlxsXm3d_&response=${captcha}`
        );

        if (!captchaVerify.data.success) {
            return res.status(400).json({ error: "Captcha verification failed" });
        }

        // ✅ Ab user check karo
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length === 0) return res.status(400).json({ error: "User not found" });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

            res.json({ message: "Login successful!", user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ==================== FORGOT PASSWORD ====================
router.post("/forgot-password", async (req, res) => {
    const { email, captcha } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });
    if (!captcha) return res.status(400).json({ error: "Captcha is required" });

    try {
        // ✅ Captcha verify karo
        const captchaVerify = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=6LfjibArAAAAAFSMBtMBoYiOhV6V__qUlxsXm3d_&response=${captcha}`
        );

        if (!captchaVerify.data.success) {
            return res.status(400).json({ error: "Captcha verification failed" });
        }

        // ✅ Abhi ka original forgot password logic
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
            if (err) return res.status(500).json({ error: err });

            if (result.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const token = crypto.randomBytes(32).toString("hex");

            db.query(
                "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
                [email, token],
                (err) => {
                    if (err) return res.status(500).json({ error: "Database error" });

                    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

                    const mailOptions = {
                        from: "sinhaharsh596@gmail.com",
                        to: email,
                        subject: "Password Reset Request",
                        text: `Click the link to reset your password: ${resetLink}`,
                    };

                    transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: "Error sending email" });
                        }
                        res.json({ message: "Reset link sent to email" });
                    });
                }
            );
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ==================== RESET PASSWORD ====================
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password required" });
    }

    try {
        // ✅ Check token valid or expired
        db.query(
            "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
            [token],
            async (err, result) => {
                if (err) return res.status(500).json({ error: "Database error" });
                if (result.length === 0) {
                    return res.status(400).json({ message: "Invalid or expired token" });
                }

                const email = result[0].email;

                // ✅ Hash new password
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // ✅ Update user password
                db.query(
                    "UPDATE users SET password = ? WHERE email = ?",
                    [hashedPassword, email],
                    (err) => {
                        if (err) return res.status(500).json({ error: "Database error" });

                        // ✅ Delete token after use
                        db.query("DELETE FROM password_resets WHERE email = ?", [email]);

                        res.json({ message: "Password reset successful" });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

//get all users
router.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result); // sabhi users ka data return karega
    });
});

// ==================== DELETE USER ====================
router.delete("/users/:id", (req, res) => {
    const userId = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;
