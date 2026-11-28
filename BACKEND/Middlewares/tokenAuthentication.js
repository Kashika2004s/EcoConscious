
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        return res.status(500).json({
            message: "Server authentication configuration error"
        });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized: No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: Invalid token format"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(403).json({
                message: "Forbidden: Invalid or expired token"
            });
        }

        if (!decoded.userId) {
            return res.status(403).json({
                message: "User ID missing from authentication token"
            });
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    });
};

module.exports = authenticateToken;
