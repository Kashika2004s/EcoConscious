// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // MySQL database connection

// router.get("/", async (req, res) => {
//   const userId = req.user.id; // Ensure user ID is extracted from authentication middleware

//   try {
//     const query = "SELECT username, fullname, email, address, phoneNumber FROM users WHERE id = ?";
    
//     db.query(query, [userId], (err, results) => {
//       if (err) {
//         console.error("Error fetching user profile:", err);
//         return res.status(500).json({ message: "Error fetching profile details" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const user = results[0];
//       res.status(200).json({
//         username: user.username,
//         fullName: user.fullname,
//         email: user.email,
//         address: user.address,
//         mobileNumber: user.phoneNumber,
//       });
//     });
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = router;
const express = require("express");
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  console.log("✅ Profile route hit");
  console.log("🔹 Extracted User ID:", req.user.id);

  try {
    const [users] = await db.execute(
      "SELECT fullname, email, address, phoneNumber FROM users WHERE id = ?",
      [req.user.id]
    );

    console.log("🔹 DB Query Result:", users);

    if (users.length === 0) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
