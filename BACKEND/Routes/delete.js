const express = require("express");
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

const router = express.Router();

// DELETE route to delete user details using token info
router.delete("/", authenticateToken, async (req, res) => {
  console.log("✅ Delete route hit");
  console.log("🔹 Extracted User ID:", req.user.userId);

  const userId = req.user.id; // Get user ID from token

  try {
    const [result] = await db.execute(
      "DELETE FROM users WHERE userId = ?",
      [userId]
    );

    console.log("🔹 DB Delete Result:", result);

    if (result.affectedRows === 0) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
