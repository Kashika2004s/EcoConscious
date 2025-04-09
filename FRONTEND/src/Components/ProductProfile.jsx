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
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProduct = async () => {
      try {
        // Fetch product details
        const productRes = await fetch(`http://localhost:3000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const productData = await productRes.json();
        if (!productRes.ok) throw new Error(productData.message || "Failed to fetch product");

        setProduct(productData);

        // Fetch wishlist
        const wishlistRes = await fetch("http://localhost:3000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const wishlistData = await wishlistRes.json();
        if (!wishlistRes.ok) throw new Error("Failed to fetch wishlist");

        const inWishlist = wishlistData.some((item) => item.id === productData.id);
        setIsInWishlist(inWishlist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const checkWishlist = async () => {
      try {
          const response = await fetch("http://localhost:3000/api/wishlist", {
              headers: {
                  Authorization:` Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
              },
          });
          const data = await response.json();
          
          if (response.ok) {
              // ✅ Check against id, not productId
              const inWishlist = data.some((item) => item.id === product?.id); // or ._id if needed
              console.log("🛍 Wishlist contains product:", inWishlist);
              setIsInWishlist(inWishlist);
          } else {
              console.error("Error checking wishlist status");
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

    const token = localStorage.getItem("token");
    const productData = {
      id: product.id,
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
          Authorization: `Bearer ${token}`,
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
      console.error("Error adding to wishlist:", error.message);
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
        navigate(`/order/${data.order._id}`);
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

    if (!product?.id) {
      alert("Invalid product");
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
      if (response.ok) {
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
      <div
        style={{
          display: "flex",
          padding: "50px 10px",
          maxWidth: "100%",
          margin: "0 auto",
          gap: "20px",
          alignItems: "stretch",
          height: "95vh",
        }}
      >
        {/* Product Image */}
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={product.image || "https://via.placeholder.com/600"}
            alt={product.name || "Product"}
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

        {/* Product Info */}
        <div
          style={{
            flex: 1,
            padding: "20px 0px 40px 30px",
            minWidth: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ margin: "0", padding: "0" }}>{product.name}</h1>
          <p style={{ fontSize: "28px", color: "#e63946", margin: "0" }}>
            Price: ${product.price}
          </p>

          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#ffcc00", marginRight: "15px", fontSize: "20px" }}>
              ★★★★★
            </span>
            <a href="#reviews" style={{ color: "#333", fontSize: "18px" }}>
              3 reviews
            </a>
          </div>

          <p style={{ color: "#555", lineHeight: "1.8", fontSize: "18px" }}>
            {product.description}
          </p>

          <p style={{ fontSize: "18px" }}>
            <strong>Availability:</strong> {product.inStock ? "In stock" : "Out of stock"}
          </p>
          <p style={{ fontSize: "18px" }}>
            <strong>Product Type:</strong> {product.category}
          </p>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={handleQuantityChange}
              style={{
                width: "70px",
                padding: "10px",
                marginRight: "15px",
                fontSize: "18px",
              }}
            />
            <button
              style={{
                padding: "10px 20px",
                border: "1px solid #000",
                cursor: "pointer",
                backgroundColor: "#fff",
                color: "#000",
                marginRight: "15px",
                display: "flex",
                alignItems: "center",
                fontSize: "15px",
                width: "200px",
              }}
              onClick={addToCart}
              onMouseEnter={() => setHoveredIcon("cart")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <i
                className={
                  hoveredIcon === "cart"
                    ? "fas fa-cart-plus"
                    : "fas fa-shopping-cart"
                }
                style={{
                  marginRight: "20px",
                  fontSize: "24px",
                  color:
                    hoveredIcon === "cart" || isInWishlist ? "#088F8F" : "#ccc",
                }}
              ></i>
              ADD TO CART
            </button>

            <button
              style={{
                padding: "10px 20px",
                border: "1px solid #000",
                cursor: "pointer",
                backgroundColor: "#fff",
                color: "#000",
                display: "flex",
                alignItems: "center",
                fontSize: "15px",
                width: "217px",
              }}
              onClick={addToWishlist}
              onMouseEnter={() => setHoveredIcon("heart")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <i
                className="fas fa-heart"
                style={{
                  marginRight: "20px",
                  fontSize: "24px",
                  color:
                    hoveredIcon === "heart" || isInWishlist ? "#ff0000" : "#ccc",
                }}
              ></i>
              {isInWishlist ? "IN WISHLIST" : "ADD TO WISHLIST"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
            <button
              style={{
                padding: "16px 25px",
                backgroundColor: "#000",
                color: "#fff",
                cursor: "pointer",
                fontSize: "25px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={buyNow}
            >
              <i className="fas fa-credit-card" style={{ marginRight: "10px" }}></i>
              Buy Now
            </button>
          </div>
        </div>

        {/* Right Sticky Panel */}
        <div
          style={{
            position: "sticky",
            right: "0",
            width: "120px",
            paddingRight: "10px",
            backgroundColor: "#fff",
            zIndex: "1",
            marginTop: "150px",
          }}
        >
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
          <Alternative productId={product._id} category={product.category} />
          </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductProfile;
