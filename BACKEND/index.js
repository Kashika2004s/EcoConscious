const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
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
const wishlistRouter=require("./Routes/wishlist");
const deleteRouter=require("./Routes/delete");
const cartRouter=require("./Routes/cart");
const editRouter=require("./Routes/edit");
const searchRouter = require("./Routes/search");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

db.execute("SELECT 1")
  .then(() => {
    console.log("✅ MySQL Database Connected!");

    app.use(cors({ 
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"], 
      credentials: true 
    }));
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use("/uploads", express.static("uploads"));

    // ✅ Correct route setup
    app.use("/api/signup", signupRouter);
    app.use("/api/login", loginRouter);
    app.use("/verify", verifyRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/bestproduct", authenticateToken, bestProductRouter);
    app.use("/api/profile", authenticateToken, profileRouter);
    app.use("/api/delete",authenticateToken,deleteRouter);
    app.use("/api/wishlist", authenticateToken, wishlistRouter);
    app.use("/api/cart", authenticateToken, cartRouter);
    app.use("/api/edit",authenticateToken,editRouter);
    app.use("/api/search", searchRouter); 

    app.use("*", (req, res) => {
      res.status(404).json({ message: "❌ Route not found" });
    });

    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

  })
  .catch((err) => {
    console.error("❌ MySQL Database Connection Failed:", err.message);
    process.exit(1);
  });