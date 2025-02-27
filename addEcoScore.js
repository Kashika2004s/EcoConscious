const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from a .env file

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Kashika4680@",
  database: process.env.DB_NAME || "ecommerce",
});

// Function to calculate the ecoScore
const calculateEcoScore = (product) => {
  let score = 0;
  const carbonFootprint = product.carbonFootprint || 0;
  const materialSourcing = product.materialSourcing
    ? product.materialSourcing.toLowerCase()
    : "good";
  const recyclability = product.recyclability || 0;
  const waterUsage = product.waterUsage
    ? product.waterUsage.toLowerCase()
    : "low";
  const energyEfficiency = product.energyEfficiency
    ? product.energyEfficiency.toLowerCase()
    : "low";
  const biodegradability = product.biodegradability || 0;
  const durability = product.durability || "0 months";

  // Scoring calculations
  score += carbonFootprint * 0.2;
  const materialSourcingScores = { good: 40, better: 70, best: 100 };
  score += (materialSourcingScores[materialSourcing] || 40) * 0.2;
  score += recyclability * 0.2;
  const waterUsageScores = { high: 30, moderate: 60, low: 100 };
  score += (waterUsageScores[waterUsage] || 100) * 0.1;
  const energyEfficiencyScores = { high: 100, moderate: 70, low: 40 };
  score += (energyEfficiencyScores[energyEfficiency] || 40) * 0.1;
  score += biodegradability * 0.1;

  // Convert durability to months
  const durabilityInMonths = durability.includes("month")
    ? parseInt(durability)
    : parseInt(durability) * 12;
  const durabilityScore = Math.min(durabilityInMonths / 12, 1) * 10;
  score += durabilityScore;

  return parseFloat(Math.min(score, 100).toFixed(2));
};

// Fetch products from the database
db.query("SELECT * FROM products", (err, results) => {
  if (err) {
    console.error("Error fetching data from database:", err);
    return;
  }

  const updatedProducts = results.map((product) => {
    const ecoScore = calculateEcoScore(product);
    return { id: product.id, ecoScore };
  });

  // Update ecoScore for each product
  updatedProducts.forEach(({ id, ecoScore }) => {
    db.query(
      "UPDATE products SET ecoScore = ? WHERE id = ?",
      [ecoScore, id],
      (err) => {
        if (err) {
          console.error(`Error updating ecoScore for product ID ${id}:`, err);
        } else {
          console.log(`Updated ecoScore for product ID ${id}: ${ecoScore}`);
        }
      }
    );
  });

  db.end(); // Close the database connection
});
