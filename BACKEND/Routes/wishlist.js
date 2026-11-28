
const express = require("express");
const router = express.Router();
const db = require("../db");

// Authentication is already applied in server.js.
// Do not import or apply another authentication middleware here.

// GET: Fetch wishlist items
router.get("/", async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        const [wishlistItems] = await db.execute(
            `SELECT
                productId AS id,
                name,
                price,
                image,
                description
             FROM wishlist
             WHERE userId = ?`,
            [userId]
        );

        return res.status(200).json(wishlistItems);

    } catch (error) {
        console.error("Error fetching wishlist:", error);

        return res.status(500).json({
            message: "Unable to fetch wishlist"
        });
    }
});


// POST: Add item to wishlist
router.post("/add", async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        const {
            id: productId,
            name,
            price,
            image,
            description
        } = req.body;

        // Validate required fields
        if (
            productId == null ||
            !name ||
            price == null ||
            !image ||
            !description
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // Check existing wishlist item
        const [existing] = await db.execute(
            `SELECT productId
             FROM wishlist
             WHERE userId = ? AND productId = ?`,
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Item already in wishlist"
            });
        }

        // Insert wishlist item
        await db.execute(
            `INSERT INTO wishlist
                (userId, productId, name, price, image, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                productId,
                name,
                price,
                image,
                description
            ]
        );

        return res.status(201).json({
            message: "Item added to wishlist"
        });

    } catch (error) {
        console.error("Error adding to wishlist:", error);

        return res.status(500).json({
            message: "Unable to add item to wishlist"
        });
    }
});


// DELETE: Remove item from wishlist
router.delete("/remove/:id", async (req, res) => {
    try {
        const userId = req.user?.userId;
        const productId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        const [result] = await db.execute(
            `DELETE FROM wishlist
             WHERE userId = ? AND productId = ?`,
            [userId, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Wishlist item not found"
            });
        }

        return res.status(200).json({
            message: "Item removed from wishlist"
        });

    } catch (error) {
        console.error("Error removing wishlist item:", error);

        return res.status(500).json({
            message: "Unable to remove wishlist item"
        });
    }
});

module.exports = router;
