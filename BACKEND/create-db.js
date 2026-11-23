
const mysql = require("mysql2/promise");
require("dotenv").config();

async function createDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306
    });

    console.log("AWS MySQL connected!");

    await connection.query(
      "CREATE DATABASE IF NOT EXISTS ecommerce"
    );

    console.log("Ecommerce database created successfully!");

  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createDatabase();
