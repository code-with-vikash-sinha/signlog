const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const transporter = require("../config/mail");
const router = express.Router();

// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

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
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ==================== LOGIN ====================
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(400).json({ error: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        res.json({ message: "Login successful!", user: { id: user.id, name: user.name, email: user.email } });
    });
});

// ==================== FORGOT PASSWORD ====================
router.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Reset link (localhost for now)
        const resetLink = `http://localhost:3000/reset-password?email=${email}`;

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
    });
});

// ==================== RESET PASSWORD ====================
router.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email],
            (err, result) => {
                if (err) return res.status(500).json({ error: "Database error" });

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "User not found" });
                }

                res.json({ message: "Password reset successful" });
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
