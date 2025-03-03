// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const authenticateToken = (req, res, next) => {
//   // Get token from authorization header
//   const token = req.headers['authorization']?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. Please log in again.' });
//   }

//   // Verify the token using the secret key from environment variables
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       // Handle specific errors
//       if (err.name === 'TokenExpiredError') {
//         return res.status(401).json({ message: 'Session expired. Please log in again.' });
//       } else {
//         return res.status(403).json({ message: 'Invalid token.' });
//       }
//     }

//     // Attach the user data to the request object for further use
//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔹 Received Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token found or incorrect format");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    console.log("✅ Token Verified! Extracted user:", user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
