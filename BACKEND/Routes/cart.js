const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ DB connection
const authenticate = require("../Middlewares/authmiddleware"); // ✅ Auth middleware

// ✅ Get all cart items for the logged-in user
router.get("/", authenticate, async (req, res) => {
    const userId = req.user.userId;



    try {
        const [cartItems] = await db.query(
            // `SELECT id, productId, name, price, image, quantity, FROM cart WHERE userId = ?`,
            `SELECT id, name, price, image, quantity, (price * quantity) AS totalPrice FROM cart WHERE userId = ?`,
            [userId]

        );
        res.status(200).json(cartItems);

    } catch (error) {
        console.error("❌ Error fetching cart:", error);
        res.status(500).json({ message: "Internal Server Error" });

    }

});





/*


/*
// ✅ Add a product to cart
router.post("/add", authenticate, async (req, res) => {
    const { productId, name, price, image, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId || !name || !price || !image) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const [existing] = await db.query(
            "SELECT * FROM cart WHERE userId = ? AND productId = ?",
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Item already in cart" });
        }

        await db.query(
            "INSERT INTO cart (userId, productId, name, price, image, quantity) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, productId, name, price, image, quantity]
        );

        res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
        console.error("❌ Error adding item to cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
*/
// ✅ Add or Update product in cart
router.post("/add", authenticate, async (req, res) => {
    const { productId, name, price, image, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId || !name || !price || !image) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const [existing] = await db.query(
            "SELECT * FROM cart WHERE productId = ? AND userId = ?",
            [productId, userId]
        );

        if (existing.length > 0) {
            // ✅ Product already exists in cart, update quantity
            await db.query(
                "UPDATE cart SET quantity = quantity + ? WHERE productId = ? AND userId = ?",
                [quantity, productId, userId]
            );
        } else {
            // ✅ New product, insert into cart
            await db.query(
                "INSERT INTO cart (userId, productId, name, price, image, quantity) VALUES (?, ?, ?, ?, ?, ?)",
                [userId, productId, name, price, image, quantity]
            );
        }

        res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
        console.error("❌ Error adding/updating cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// // ✅ Remove a product from the cart by cart item ID
router.delete("/remove/:id", authenticate, async (req, res) => {
    const userId = req.user.userId;
    const cartItemId = req.params.id;

    try {
        await db.query(
            "DELETE FROM cart WHERE userId = ? AND id = ?",
            [userId, cartItemId]
        );
        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("❌ Error removing item from cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;