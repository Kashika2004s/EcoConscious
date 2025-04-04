const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Received Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token found or incorrect format");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    console.log("Token Verified! Extracted user:", user);
    
    // ⬇️ Update this line based on the payload structure
    req.user = { id: user.userId }; // or user.id if you already sign with `id`
    next();
  });
};

module.exports = authenticateToken;
