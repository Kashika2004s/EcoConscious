const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');

const router = express.Router();

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /api/feedback
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { orderId, comments } = req.body;
    if (!orderId || !comments) {
      return res.status(400).json({ message: 'orderId and comments are required' });
    }

    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `INSERT INTO feedback (order_id, comments, photo_path) VALUES (?, ?, ?)`;
    await db.execute(sql, [orderId, comments, photoPath]);

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
});

module.exports = router;
