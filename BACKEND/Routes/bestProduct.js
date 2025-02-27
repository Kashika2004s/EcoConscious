const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "your_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Route to fetch the best ecoScore product from each category
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Query to get the best ecoScore product for each category
    const query = `
      SELECT p.*
      FROM products p
      INNER JOIN (
          SELECT category, MAX(ecoScore) AS maxEcoScore
          FROM products
          WHERE category IN ('Beauty Products', 'Clothing', 'Footwear', 'Bags')
          GROUP BY category
      ) best ON p.category = best.category AND p.ecoScore = best.maxEcoScore;
    `;

    const [rows] = await connection.query(query);
    connection.release(); // Release the connection

    if (rows.length === 0) {
      return res.status(404).json({ message: "No products found in any category" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
