const express = require("express");
const router = express.Router();
const db = require("../db");
require("dotenv").config();

router.get("/verify", async (req, res) => {
  try {
    const { token } = req.query;

    // Check if token exists
    const [users] = await db.execute("SELECT * FROM users WHERE verification_token = ?", [token]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    // Update user as verified
    await db.execute("UPDATE users SET isVerified = 1, verification_token = NULL WHERE verification_token = ?", [
      token,
    ]);

    res.redirect(`${process.env.BASE_URL || "http://localhost:3000"}/login`);
  } catch (error) {
    console.error("❌ Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
