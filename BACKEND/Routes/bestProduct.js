
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT p.*
            FROM products p
            INNER JOIN (
                SELECT category, MAX(ecoScore) AS maxEcoScore
                FROM products
                WHERE category IN (
                    'Beauty Products',
                    'Clothing',
                    'Footwear',
                    'Bags'
                )
                GROUP BY category
            ) best
            ON p.category = best.category
            AND p.ecoScore = best.maxEcoScore
        `;

        const [rows] = await db.execute(query);

        return res.status(200).json(rows);

    } catch (error) {
        console.error("Best Products Error:", error);

        return res.status(500).json({
            message: "Unable to fetch best products"
        });
    }
});

module.exports = router;
