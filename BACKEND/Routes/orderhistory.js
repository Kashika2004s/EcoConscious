const express = require('express');
const router = express.Router();
const connection = require('../db');
const authenticateToken = require('../Middlewares/tokenAuthentication');

// GET all orders for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all orders for this user
    const [orders] = await connection.query(
      `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Fetch items for all orders
    const orderIds = orders.map(order => order.id);
    const [allItems] = await connection.query(
      `SELECT * FROM order_items WHERE orderId IN (?)`,
      [orderIds]
    );

    // Group items by orderId
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
        quantity: item.quantity
      });
    });

    // Attach items to their corresponding orders
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: groupedItems[order.id] || []
    }));

    res.json({ orders: ordersWithItems });
  } catch (error) {
    console.error('🔥 Error fetching order history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
