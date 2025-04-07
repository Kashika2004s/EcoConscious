const express = require("express");
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  console.log("✅ /api/profile route hit");
  console.log("🧠 Decoded user in req.user:", req.user);

  const userId = req.user.userId;

  if (!userId) {
    console.log("❌ userId missing in token!");
    return res.status(400).json({ message: "Missing userId in token" });
  }

  try {
    const [users] = await db.execute(
      `SELECT userId, username, email, first_name, last_name, phoneNumber, street, city, state_zip, created_at, isVerified
       FROM users 
       WHERE userId = ?`, // ✅ FIXED: was `userid`
      [userId]
    );

    console.log("📦 Fetched user:", users);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error("❌ DB Error in /api/profile:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
