
const express = require("express");
const router = express.Router();

const db = require("../db");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const FRONTEND_URL = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/$/, "");

// GET /verify?token=...
router.get("/", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing.",
      });
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Validate JWT and expiry
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check token purpose
    if (
      decoded.purpose !== "email_verification" ||
      !decoded.email
    ) {
      return res.status(400).json({
        message: "Invalid verification token.",
      });
    }

    // Find user with this exact verification token
    const [users] = await db.execute(
      `SELECT userid, email, isVerified
       FROM users
       WHERE verification_token = ?`,
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired verification link.",
      });
    }

    const user = users[0];

    // Ensure token belongs to this user's email
    if (user.email !== decoded.email) {
      return res.status(400).json({
        message: "Invalid verification token.",
      });
    }

    if (Number(user.isVerified) === 1) {
      return res.redirect(
        `${FRONTEND_URL}/login?verified=already`
      );
    }

    // Verify user and clear token
    const [result] = await db.execute(
      `UPDATE users
       SET isVerified = 1,
           verification_token = NULL
       WHERE userid = ?
       AND verification_token = ?`,
      [user.userid, token]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Verification failed. Please request a new link.",
      });
    }

    console.log("Email verified successfully:", user.email);

    // Redirect to deployed frontend login page
    return res.redirect(
      `${FRONTEND_URL}/login?verified=success`
    );

  } catch (error) {
    console.error("Email Verification Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Verification link has expired. Please request a new one.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        message: "Invalid verification link.",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error.",
    });
  }
});

module.exports = router;
