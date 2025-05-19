const express = require("express");
const router = express.Router();
const db = require("../db"); 
const authenticateToken = require("../Middlewares/tokenAuthentication");

router.get("/:term", authenticateToken, async (req, res) => {
    const { term } = req.params;
    try {
        const [products] = await db.execute(
            "SELECT * FROM products WHERE name LIKE ?",
            [`%${term}%`]
        );
        res.json(products);
    } catch (error) {
        console.error("Error while fetching products:", error);
        res.status(500).send("Error searching for products.");
    }
});

module.exports = router;
