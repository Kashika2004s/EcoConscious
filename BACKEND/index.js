const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const db = require("./db");
const errorHandler = require("./Middlewares/errorHandler");
const authenticateToken = require("./Middlewares/tokenAuthentication");

// Import Routes
const signupRouter = require("./Routes/signup");
const loginRouter = require("./Routes/login");
const verifyRouter = require("./Routes/verify");
const productsRouter = require("./Routes/products");
const bestProductRouter = require("./Routes/bestProduct");
const profileRouter = require("./Routes/profile");
const wishlistRouter = require("./Routes/wishlist");
const deleteRouter = require("./Routes/delete");
const cartRouter = require("./Routes/cart");
const feedbackRouter = require("./Routes/feedback");
const editRouter = require("./Routes/edit");
const alternativeRoute = require("./Routes/alternatives");
const searchRouter = require("./Routes/search");
const orderRoutes = require("./Routes/order");
const orderhistoryRoutes = require("./Routes/orderhistory");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

db.execute("SELECT 1")
  .then(() => {
    console.log("✅ MySQL Database Connected!");

    // ✅ CORS setup
    const allowedOrigins = [
      "http://localhost:5173",
      "https://eco-conscious-4cca.vercel.app"
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        console.log("🌐 Request Origin:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error("❌ CORS blocked origin:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      optionsSuccessStatus: 200
    };

    // ✅ Apply CORS middleware
    app.use(cors(corsOptions));

    // ✅ Handle preflight requests
    app.options("*", cors(corsOptions));

    // ✅ Middleware setup
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // ✅ Routes setup
    app.use("/api/signup", signupRouter);
    app.use("/api/login", loginRouter);
    app.use("/verify", verifyRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/bestproduct", authenticateToken, bestProductRouter);
    app.use("/api/profile", authenticateToken, profileRouter);
    app.use("/api/delete", authenticateToken, deleteRouter);
    app.use("/api/wishlist", authenticateToken, wishlistRouter);
    app.use("/api/cart", authenticateToken, cartRouter);
    app.use("/api/edit", authenticateToken, editRouter);
    app.use("/api/order", authenticateToken, orderRoutes);
    app.use("/api/search", searchRouter);
    app.use("/api/alternatives", alternativeRoute);
    app.use("/api/order-history", authenticateToken, orderhistoryRoutes);
    app.use("/api/feedback", authenticateToken, feedbackRouter);

    // ✅ Root route
    app.get("/", (req, res) => {
      res.send("Welcome to EcoConscious backend!");
    });

    // ✅ 404 handler
    app.use("*", (req, res) => {
      res.status(404).json({ message: "❌ Route not found" });
    });

    // ✅ Global error handler
    app.use(errorHandler);

    // ✅ Start server
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MySQL Database Connection Failed:", err.message);
    process.exit(1);
  });
