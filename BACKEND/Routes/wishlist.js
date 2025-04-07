const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ Ensure correct db import
const authenticate = require("../Middlewares/authmiddleware");

// ✅ Route to get wishlist items
router.get("/", authenticate, async (req, res) => {
    const userId = req.user.userId;

    try {
        // ❌ db.promise().query(...) ka use mat karo
        const [wishlistItems] = await db.query(
            `SELECT id, name, price, image, description FROM wishlist WHERE userId = ?`,
            [userId]
        );

        res.status(200).json(wishlistItems);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Route to add to wishlist
router.post("/add", authenticate, async (req, res) => {
    console.log("✅ Incoming request body:", req.body); // 🔍 Check what frontend is sending

    const { id: productId, name, price, image, description } = req.body;
    const userId = req.user.userId;

    // ✅ Check if required fields are missing
    if (!productId || !name || !price || !image || !description) {
        console.log("❌ Missing required fields:", req.body);
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const [existing] = await db.query(
            "SELECT * FROM wishlist WHERE userId = ? AND id = ?",
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Item already in wishlist" });
        }

        await db.query(
            "INSERT INTO wishlist (userId, id, name, price, image, description) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, productId, name, price, image, description]
        );

        res.status(201).json({ message: "Item added to wishlist" });
    } catch (error) {
        console.error("❌ Error adding to wishlist:", error.message, error.stack);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// ✅ Route to remove from wishlist
router.delete("/remove/:id", authenticate, async (req, res) => {
    const userId = req.user.userId;
    const productId = req.params.id;

    try {
        await db.query(
            "DELETE FROM wishlist WHERE userId = ? AND id = ?",
            [userId, productId]
        );

        res.status(200).json({ message: "Item removed from wishlist" });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
