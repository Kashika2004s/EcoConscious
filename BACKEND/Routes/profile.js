const express = require("express");
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  console.log("Profile route hit");
  console.log("Extracted User ID:", req.user.id);

  try {
    const [users] = await db.execute(
      "SELECT fullname, email, address, phoneNumber FROM users WHERE id = ?",
      [req.user.id]
    );

    console.log("🔹 DB Query Result:", users);

    if (users.length === 0) {
      console.log("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
