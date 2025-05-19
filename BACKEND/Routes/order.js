const express = require('express');
const router = express.Router();
const connection = require('../db');
const authenticateToken = require('../Middlewares/tokenAuthentication');

// 🛒 PLACE ORDER from CART
router.post('/place-order', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [cartItems] = await connection.query(
      `SELECT c.productId, c.quantity, p.price, p.image, p.name 
       FROM cart c 
       JOIN products p ON c.productId = p.id 
       WHERE c.userId = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty!' });
    }

    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    const [orderResult] = await connection.query(
      `INSERT INTO orders (userId, totalPrice, createdAt) VALUES (?, ?, NOW())`,
      [userId, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items (orderId, productId, quantity, price, image, name) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price, item.image, item.name]
      );
    }

    await connection.query(`DELETE FROM cart WHERE userId = ?`, [userId]);

    res.status(201).json({
      message: 'Order placed successfully!',
      order: { _id: orderId }
    });
  } catch (error) {
    console.error('🔥 Error placing order (cart):', error);
    res.status(500).json({ message: 'Error placing order. Please try again.' });
  }
});

// 💳 BUY NOW (single product)
router.post('/buy-now', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity, price, image } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const totalPrice = quantity * price;

    // Fetch product name for the given productId
    const [productRes] = await connection.query(
      `SELECT name FROM products WHERE id = ?`,
      [productId]
    );
    const name = productRes[0]?.name || "Product";

    const [orderResult] = await connection.query(
      `INSERT INTO orders (userId, totalPrice, createdAt) VALUES (?, ?, NOW())`,
      [userId, totalPrice]
    );

    const orderId = orderResult.insertId;

    await connection.query(
      `INSERT INTO order_items (orderId, productId, quantity, price, image, name) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, productId, quantity, price, image || null, name]
    );

    res.status(201).json({
      message: 'Order placed successfully!',
      order: { _id: orderId }
    });
  } catch (error) {
    console.error('🔥 Error placing order (buy-now):', error);
    res.status(500).json({ message: 'Error placing order. Please try again.' });
  }
});

// 📦 GET ORDER DETAILS by ID
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const [orders] = await connection.query(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await connection.query(
      `SELECT productId, quantity, price, image, name FROM order_items WHERE orderId = ?`,
      [orderId]
    );

    const transformedItems = items.map(item => ({
      productId: {
        _id: item.productId,
        name: item.name,
        image: item.image,
        price: item.price
      },
      quantity: item.quantity
    }));

    res.status(200).json({ order: { ...orders[0], items: transformedItems } });
  } catch (error) {
    console.error('🔥 Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order data' });
  }
});

// 🔍 GET PRODUCT BY ID
router.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const [results] = await connection.query(
      `SELECT * FROM products WHERE id = ?`,
      [productId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('🔥 Error retrieving product:', err);
    res.status(500).json({ message: 'Error retrieving product', error: err });
  }
});

module.exports = router;
