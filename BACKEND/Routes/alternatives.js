const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:category/:id", async (req, res) => {
  const { category, id } = req.params;

  try {
    const [productResult] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (productResult.length === 0) return res.status(404).json({ message: "Product not found" });

    const currentProduct = productResult[0];

    const [products] = await db.query(
      "SELECT * FROM products WHERE category = ? AND productType = ?",
      [category, currentProduct.productType]
    );

    const sorted = products.sort((a, b) => {
      if (b.ecoScore !== a.ecoScore) return b.ecoScore - a.ecoScore;
      if (a.carbonFootprint !== b.carbonFootprint) return a.carbonFootprint - b.carbonFootprint;
      return b.biodegradability - a.biodegradability;
    });

    const currentIndex = sorted.findIndex(p => p.id === currentProduct.id);

    if (currentIndex === 0) {
      return res.status(200).json({ message: "Congratulations! You're using the best product!", alternatives: [] });
    }

    const betterAlternatives = sorted.slice(0, currentIndex);
    return res.status(200).json({ alternatives: betterAlternatives.slice(0, 3) });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error while fetching alternatives" });
  }
});

module.exports = router;
