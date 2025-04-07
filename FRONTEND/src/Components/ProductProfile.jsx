import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EnvironmentCriteria from "./EnvironmentCriteria";
import Alternative from "./Alternative";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "./Footer";

const ProductProfile = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
        } else {
          setError(data.message || "Failed to fetch product");
        }
      } catch (error) {
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    const checkWishlist = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          const inWishlist = data.some((item) => item.productId === productId);
          setIsInWishlist(inWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    if (token) {
      fetchProduct();
      checkWishlist();
    } else {
      setLoading(false);
      setError("You need to be logged in to view product details.");
    }
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    setQuantity(Math.min(Math.max(1, value), 20));
  };

  const addToWishlist = async () => {
    if (!product) return;
    const productData = {

      // HERE - 
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    };

    try {
      const response = await fetch("http://localhost:3000/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      if (response.ok) {
        setIsInWishlist(true);
        alert(result.message);
        navigate("/wishlist");
      } else {
        throw new Error(result.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error in wishlist request:", error.message);
    }
  };

  const buyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to place an order.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/order/buy-now", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          price: product.price,
          image: product.image,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate(`/order/${data.order.id}`);
      } else {
        alert(data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order. Please try again.");
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to add items to your cart.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity,
        }),
      });
  
      const data = await response.json();
      // if (response.ok) {
      //   alert(data.message);
      //   navigate("/cart");
      // } else {
      //   alert(data.message || "Error adding to cart");
      // }

      if (response.ok) {
        setIsInCart(true); // ✅ Update icon state here
        alert(data.message);
        navigate("/cart");
      } else {
        alert(data.message || "Error adding to cart");
      }
  
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div style={{ display: "flex", padding: "50px 10px", gap: "20px", height: "95vh" }}>
        {/* Image Section */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src={product.image || "https://via.placeholder.com/600"}
            alt={product.name}
            style={{
              width: "90%",
              height: "80vh",
              padding: "20px",
              objectFit: "contain",
              borderLeft: "2px solid #d3d3d3",
              borderRight: "2px solid #d3d3d3",
            }}
          />
        </div>

        {/* Product Details Section */}
        <div style={{ flex: 1, padding: "20px 0px 40px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <h1>{product.name}</h1>
          <p style={{ fontSize: "28px", color: "#e63946" }}>Price: ${product.price}</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#ffcc00", marginRight: "15px", fontSize: "20px" }}>★★★★★</span>
            <a href="#reviews" style={{ color: "#333", fontSize: "18px" }}>3 reviews</a>
          </div>
          <p style={{ color: "#555", fontSize: "18px" }}>{product.description}</p>
          <p><strong>Availability:</strong> {product.inStock ? "In stock" : "Out of stock"}</p>
          <p><strong>Product Type:</strong> {product.category}</p>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: "70px", padding: "10px", marginRight: "15px", fontSize: "18px" }}
            />
            <button onClick={addToCart} style={{ padding: "10px 20px", border: "1px solid #000", backgroundColor: "#fff", color: "#000", marginRight: "15px", width: "200px" }}>
              <i
                className={hoveredIcon === "cart" ? "fas fa-cart-plus" : "fas fa-shopping-cart"}
                style={{
                  marginRight: "20px",
                  fontSize: "24px",
                  color: isInCart ? "#088F8F" : hoveredIcon === "cart" ? "#088F8F" : "#ccc",
                  transition: "color 0.3s ease",
                }}
              ></i>
              ADD TO CART
            </button>

            <button onClick={addToWishlist} style={{ padding: "10px 20px", border: "1px solid #000", backgroundColor: "#fff", color: "#000", width: "217px" }}>
              <i
                className="fas fa-heart"
                style={{
                  marginRight: "20px",
                  fontSize: "24px",
                  color: isInWishlist ? "#ff0000" : hoveredIcon === "heart" ? "#ff0000" : "#ccc",
                  transition: "color 0.3s ease",
                }}
              ></i>
              {isInWishlist ? "IN WISHLIST" : "ADD TO WISHLIST"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "50px", marginBottom: "20px" }}>
            <button onClick={buyNow} style={{ padding: "16px 25px", backgroundColor: "#000", color: "#fff", fontSize: "25px", display: "flex", alignItems: "center" }}>
              <i className="fas fa-credit-card" style={{ marginRight: "10px" }}></i>
              Buy Now
            </button>
          </div>
        </div>

        {/* Right Side Section: Eco Criteria + Alternatives */}
        <div style={{ position: "sticky", right: "0", width: "120px", paddingRight: "10px", backgroundColor: "#fff", zIndex: "1", marginTop: "150px" }}>
          <EnvironmentCriteria
            ecoScore={product.ecoScore}
            details={{
              carbonFootprint: product.carbonFootprint,
              materialSourcing: product.materialSourcing,
              recyclability: product.recyclability,
              waterUsage: product.waterUsage,
              energyEfficiency: product.energyEfficiency,
              biodegradability: product.biodegradability,
              durability: product.durability,
            }}
          />
          <Alternative productId={productId} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductProfile;