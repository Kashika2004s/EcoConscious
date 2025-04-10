// const express = require("express");
// const db = require("../db");
// const authenticateToken = require("../Middlewares/tokenAuthentication");

// const router = express.Router();

// router.delete("/", authenticateToken, async (req, res) => {
//   console.log("✅ Delete route hit");
//   console.log("🔹 Extracted User ID:", req.user.userId);

//   const userId = req.user.userId; // ✅ FIXED

//   try {
//     const [result] = await db.execute(
//       "DELETE FROM users WHERE userId = ?",
//       [userId]
//     );

//     console.log("🔹 DB Delete Result:", result);

//     if (result.affectedRows === 0) {
//       console.log("User not found");
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = router;

const express = require("express");
const db = require("../db"); // Your MySQL connection file
const authenticateToken = require("../Middlewares/tokenAuthentication");

const router = express.Router();

// DELETE user route
router.delete("/", authenticateToken, async (req, res) => {
  console.log("✅ Delete route hit");

  const userId = req.user.userId; // Extracted from verified token
  console.log("🔹 Extracted User ID:", userId);

  try {
    const [result] = await db.execute(
      "DELETE FROM users WHERE userId = ?",
      [userId]
    );

    console.log("🔹 DB Delete Result:", result);

    if (result.affectedRows === 0) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
