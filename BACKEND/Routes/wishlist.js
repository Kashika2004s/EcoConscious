const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ DB connection
const authenticate = require("../Middlewares/authmiddleware"); // ✅ Auth middleware

// ✅ Get all wishlist items for the logged-in user
router.get("/", authenticate, async (req, res) => {
    const userId = req.user.userId;

    try {
        const [wishlistItems] = await db.query(
            // `SELECT id, productId, name, price, image, quantity, FROM wishlist WHERE userId = ?`,
            `SELECT id, name, price, image, quantity, (price * quantity) AS totalPrice FROM wishlist WHERE userId = ?`,
            [userId]
        );
        res.status(200).json(wishlistItems);
    } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Add a product to wishlist
router.post("/add", authenticate, async (req, res) => {
    const { productId, name, price, image, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId || !name || !price || !image) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const [existing] = await db.query(
            "SELECT * FROM wishlist WHERE userId = ? AND productId = ?",
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Item already in wishlist" });
        }

        await db.query(
            "INSERT INTO wishlist (userId, productId, name, price, image, quantity) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, productId, name, price, image, quantity]
        );

        res.status(201).json({ message: "Item added to wishlist" });
    } catch (error) {
        console.error("❌ Error adding item to wishlist:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Update quantity of a wishlist item
router.put("/update/:id", authenticate, async (req, res) => {
    const userId = req.user.userId;
    const wishlistItemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
        await db.query(
            "UPDATE wishlist SET quantity = ? WHERE id = ? AND userId = ?",
            [quantity, wishlistItemId, userId]
        );
        res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error) {
        console.error("❌ Error updating quantity:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// ✅ Remove a product from the wishlist by wishlist item ID
router.delete("/remove/:id", authenticate, async (req, res) => {
    const userId = req.user.userId;
    const wishlistItemId = req.params.id;

    try {
        await db.query(
            "DELETE FROM wishlist WHERE userId = ? AND id = ?",
            [userId, wishlistItemId]
        );
        res.status(200).json({ message: "Item removed from wishlist" });
    } catch (error) {
        console.error("❌ Error removing item from wishlist:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;