
const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

// GET ALL ORDERS FOR LOGGED-IN USER
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch user's orders
        const [orders] = await db.execute(
            `SELECT *
             FROM orders
             WHERE userId = ?
             ORDER BY createdAt DESC`,
            [userId]
        );

        if (orders.length === 0) {
            return res.status(200).json({
                message: "No orders found",
                orders: []
            });
        }

        // Fetch items belonging to these orders
        const orderIds = orders.map(order => order.id);

        const placeholders = orderIds.map(() => "?").join(",");

        const [allItems] = await db.execute(
            `SELECT *
             FROM order_items
             WHERE orderId IN (${placeholders})`,
            orderIds
        );

        // Group items by order ID
        const groupedItems = {};

        allItems.forEach(item => {
            if (!groupedItems[item.orderId]) {
                groupedItems[item.orderId] = [];
            }

            groupedItems[item.orderId].push({
                productId: {
                    _id: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image
                },
                quantity: item.quantity,
                price: item.price
            });
        });

        // Attach items to orders
        const ordersWithItems = orders.map(order => ({
            ...order,
            items: groupedItems[order.id] || []
        }));

        return res.status(200).json({
            orders: ordersWithItems
        });

    } catch (error) {
        console.error("Order History Error:", error);

        return res.status(500).json({
            message: "Unable to fetch order history"
        });
    }
});

module.exports = router;
