const express = require("express");
const router = express.Router();
const db = require("../db");
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all products...");

    const [products] = await db.execute("SELECT * FROM products");

    if (products.length === 0) {
      console.log("No products found!");
      return res.status(404).json({ message: "No products available" });
    }

    console.log("Products fetched successfully");
    res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
router.get("/:category", async (req, res) => {
  const { category } = req.params;

  try {
    console.log(`Fetching products for category: ${category}`);

    const [products] = await db.execute("SELECT * FROM products WHERE category = ?", [category]);

    if (products.length === 0) {
      console.log(`No products found in category: ${category}`);
      return res.status(404).json({ message: "No products in this category" });
    }

    console.log(`Products fetched for category: ${category}`);
    res.status(200).json(products);

  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
module.exports = router;