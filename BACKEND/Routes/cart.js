const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../Middlewares/tokenAuthentication');

// Get cart items for user
router.get('/', authenticate, async (req, res) => {
    const userId = req.user.userId;

    try {
        // ❌ db.promise().query(...) ka use mat karo
        const [cartItems] = await db.query(
            `SELECT id, name, price, image, description FROM wishlist WHERE userId = ?`,
            [userId]
        );

        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add item to cart
router.post('/add', authenticate, async (req, res) => {
    const userId = req.user.userId; // ✅ FIXED
  
    const { id: productId, name, price, image, description, quantity } = req.body;
  
    if (!quantity || quantity < 1 || quantity > 20) {
      return res.status(400).json({ message: 'Quantity must be between 1 and 20' });
    }
  
    try {
      const [existingItem] = await db.query(
        'SELECT * FROM cart WHERE userId = ? AND id = ?',
        [userId, productId]
      );
  
      if (existingItem.length > 0) {
        return res.status(400).json({ message: 'Item already in cart' });
      }
  
      await db.query(
        'INSERT INTO cart (userId, id, name, price, image, description, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, productId, name, price, image, description, quantity]
      );
  
      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Error adding item to cart:', error.message);
      res.status(500).json({ message: 'Server error while adding item to cart' });
    }
  });
  

// Remove item from cart
router.delete('/remove/:id', authenticate, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.userId;

  try {
    const [result] = await db.promise().query(
      'DELETE FROM cart WHERE userId = ? AND id = ?',
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Server error while removing item from cart' });
  }
});

module.exports = router;
