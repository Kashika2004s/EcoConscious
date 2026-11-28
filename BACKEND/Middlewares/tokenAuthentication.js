
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        const authHeader = req.headers.authorization;

        // Check Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: Invalid token format"
            });
        }

        // Verify JWT
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err.message);

                return res.status(403).json({
                    message: "Forbidden: Invalid or expired token"
                });
            }

            // Ensure token contains userId
            if (!decoded.userId) {
                return res.status(403).json({
                    message: "Invalid token: User ID missing"
                });
            }

            // Attach authenticated user
            req.user = {
                userId: decoded.userId,
                email: decoded.email
            };

            next();
        });

    } catch (error) {
        console.error("Authentication Error:", error);

        return res.status(500).json({
            message: "Internal authentication error"
        });
    }
};

module.exports = authenticateToken;
