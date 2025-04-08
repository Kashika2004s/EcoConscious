const express = require("express");
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

const router = express.Router();

// PUT /api/edit
router.put("/", authenticateToken, async (req, res) => {
  console.log("✅ Edit route hit");
  const userId = req.user.userId;

  const {
    username,
    first_name,
    last_name,
    phoneNumber,
    street,
    city,
    state_zip
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE users 
       SET username = ?, 
           first_name = ?, 
           last_name = ?, 
           phoneNumber = ?, 
           street = ?, 
           city = ?, 
           state_zip = ? 
       WHERE userid = ?`,
      [username, first_name, last_name, phoneNumber, street, city, state_zip, userId]
    );

    console.log("DB Update Result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
