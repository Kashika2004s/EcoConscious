const express = require("express");
const router = express.Router();
const connection = require("../db"); // assuming you use mysql2 or mysql
const authenticateToken = require("../Middlewares/tokenAuthentication");

router.get("/:category/:id", authenticateToken, async (req, res) => {
  const { category, id } = req.params;

  try {
    // Fetch the product details from MySQL
    const [productRows] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (productRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productRows[0];

    // // Fetch alternatives from MySQL
    // const [alternatives] = await connection.execute(
    //   `SELECT * FROM products 
    //   WHERE category = ? 
    //   AND id != ? 
    //   AND productType = ? 
    //   AND ecoScore > ?`,
    //   [category, id, product.productType, product.ecoScore]
    // );
    const [alternatives] = await connection.execute(
      `SELECT * FROM products 
       WHERE category = ? 
       AND id != ? 
       LIMIT 4`,
      [category, id]
    );
        

    res.json(alternatives);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alternatives", error });
  }
});

module.exports = router;
