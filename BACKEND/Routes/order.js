
const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

// PLACE ORDER FROM CART
router.post("/place-order", authenticateToken, async (req, res) => {
    let connection;

    try {
        const userId = req.user.userId;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Fetch cart items and current product details
        const [cartItems] = await connection.execute(
            `SELECT 
                c.productId,
                c.quantity,
                p.price,
                p.image,
                p.name
             FROM cart c
             INNER JOIN products p ON c.productId = p.id
             WHERE c.userId = ?
             FOR UPDATE`,
            [userId]
        );

        if (cartItems.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                message: "Your cart is empty!"
            });
        }

        let totalPrice = 0;

        for (const item of cartItems) {
            const quantity = Number(item.quantity);
            const price = Number(item.price);

            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20 ||
                !Number.isFinite(price) || price < 0) {
                throw new Error("Invalid cart item quantity or price");
            }

            totalPrice += price * quantity;
        }

        // Create order
        const [orderResult] = await connection.execute(
            `INSERT INTO orders (userId, totalPrice, createdAt)
             VALUES (?, ?, NOW())`,
            [userId, totalPrice]
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of cartItems) {
            await connection.execute(
                `INSERT INTO order_items
                 (orderId, productId, quantity, price, image, name)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.price,
                    item.image || null,
                    item.name
                ]
            );
        }

        // Clear user's cart
        await connection.execute(
            "DELETE FROM cart WHERE userId = ?",
            [userId]
        );

        await connection.commit();

        return res.status(201).json({
            message: "Order placed successfully!",
            order: { _id: orderId }
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Place Order Error:", error);

        return res.status(500).json({
            message: "Error placing order. Please try again."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// BUY NOW - SINGLE PRODUCT
router.post("/buy-now", authenticateToken, async (req, res) => {
    let connection;

    try {
        const userId = req.user.userId;
        const { productId, quantity, image } = req.body;

        if (
            !productId ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 1 ||
            Number(quantity) > 20
        ) {
            return res.status(400).json({
                message: "Invalid product or quantity"
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Always get the actual price from database
        const [products] = await connection.execute(
            `SELECT id, name, price, image
             FROM products
             WHERE id = ?`,
            [productId]
        );

        if (products.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Product not found"
            });
        }

        const product = products[0];
        const finalPrice = Number(product.price);
        const finalQuantity = Number(quantity);

        if (!Number.isFinite(finalPrice) || finalPrice < 0) {
            throw new Error("Invalid product price");
        }

        const totalPrice = finalPrice * finalQuantity;

        const [orderResult] = await connection.execute(
            `INSERT INTO orders (userId, totalPrice, createdAt)
             VALUES (?, ?, NOW())`,
            [userId, totalPrice]
        );

        const orderId = orderResult.insertId;

        await connection.execute(
            `INSERT INTO order_items
             (orderId, productId, quantity, price, image, name)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                orderId,
                product.id,
                finalQuantity,
                finalPrice,
                product.image || image || null,
                product.name
            ]
        );

        await connection.commit();

        return res.status(201).json({
            message: "Order placed successfully!",
            order: { _id: orderId }
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Buy Now Error:", error);

        return res.status(500).json({
            message: "Error placing order. Please try again."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// GET ORDER DETAILS
router.get("/:orderId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.orderId;

        if (!/^\d+$/.test(orderId)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const [orders] = await db.execute(
            `SELECT *
             FROM orders
             WHERE id = ? AND userId = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const [items] = await db.execute(
            `SELECT productId, quantity, price, image, name
             FROM order_items
             WHERE orderId = ?`,
            [orderId]
        );

        const transformedItems = items.map(item => ({
            productId: {
                _id: item.productId,
                name: item.name,
                image: item.image,
                price: item.price
            },
            quantity: item.quantity,
            price: item.price
        }));

        return res.status(200).json({
            order: {
                ...orders[0],
                items: transformedItems
            }
        });

    } catch (error) {
        console.error("Get Order Error:", error);

        return res.status(500).json({
            message: "Error fetching order data"
        });
    }
});

module.exports = router;
