const express = require("express");
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

const router = express.Router();
router.put("/", authenticateToken, async (req, res) => {
  console.log("Edit route hit");
  console.log("Extracted User ID:", req.user.id);

  const {fullname, address, phoneNumber } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await db.execute(
      "UPDATE users SET fullname = ?, address = ?, phoneNumber = ? WHERE id = ?",
      [fullname, address, phoneNumber, userId]
    );

    console.log("DB Update Result:", result);

    if (result.affectedRows === 0) {
      console.log("User not found or no changes made");
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;