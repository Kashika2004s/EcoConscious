const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL database connection

router.get("/", async (req, res) => {
  const userId = req.user.id; // Ensure user ID is extracted from authentication middleware

  try {
    const query = "SELECT username, fullname, email, address, phoneNumber FROM users WHERE id = ?";
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching user profile:", err);
        return res.status(500).json({ message: "Error fetching profile details" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      res.status(200).json({
        username: user.username,
        fullName: user.fullname,
        email: user.email,
        address: user.address,
        mobileNumber: user.phoneNumber,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
