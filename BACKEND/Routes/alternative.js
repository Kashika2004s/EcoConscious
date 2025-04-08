const express = require("express");
const router = express.Router();
const connection = require("../db");
const authenticateToken = require("../Middlewares/tokenAuthentication");

router.get("/:category/:id", authenticateToken, (req, res) => {
// router.get("/:category/:id", authenticateToken, (req, res) => {

  const { category, id } = req.params;

  // First, get the current product details
  const getProductQuery = `SELECT * FROM products WHERE id = ?`;

  connection.query(getProductQuery, [id], (err, productResults) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResults[0];

    // Now, find alternative products in the same category and productType, with higher ecoScore
    const alternativesQuery = `
  SELECT * FROM products 
  WHERE category = ? 
    AND id != ? 
    AND productType = ? 
    AND ecoScore > ?
  ORDER BY ecoScore DESC
  LIMIT 5`;

    connection.query(
      alternativesQuery,
      [category, id, product.productType, product.ecoScore],
      (err, altResults) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to fetch alternatives", error: err });
        }

        res.json(altResults);

      }
    );
  });
});

module.exports = router;