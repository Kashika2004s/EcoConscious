
const express = require("express");
const router = express.Router();

const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                message: "Server configuration error"
            });
        }

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Check email verification
        if (Number(user.isVerified) !== 1) {
            return res.status(401).json({
                message: "Please verify your email before logging in"
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Use userid consistently with your signup/database queries
        const userId = user.userid;

        if (userId == null) {
            console.error("User ID missing from database result");

            return res.status(500).json({
                message: "Unable to identify user account"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: userId,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        console.log("Login successful for user ID:", userId);

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
