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
        const response = await fetch(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
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
          const inWishlist = data.some((item) => item.productId === id);
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to add items to your wishlist.");
      return;
    }
    if (isInWishlist) {
      alert("This item is already in your wishlist.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/wishlist/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsInWishlist(true);
        alert(data.message);
        navigate("/wishlist");
      } else {
        alert(data.message || "Error adding to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
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
          productId: product._id,
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
    try {
      const response = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
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
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          padding: "50px 10px",
          maxWidth: "100%",
          margin: "0 auto",
          gap: "20px",
          alignItems: "stretch", // Ensures both inner divs have the same height
          height: "95vh", // Ensures the main div height fills the available space
        }}
      >
        {/* Image Div */}
        <div
          style={{
            flex: 1, // Ensures the image div gets equal height
            minWidth: "280px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "center", // Center the image inside the div
            alignItems: "center", // Center the image vertically
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
              borderLeft: "2px solid #d3d3d3", // Light grey left outline
              borderRight: "2px solid #d3d3d3", // Light grey right outline
            }}
          />
        </div>
        {/* Product Details Div */}
        <div
          style={{
            flex: 1, // Ensures the product details div gets equal height
            padding: "20px 0px 40px 30px",
            minWidth: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Ensures content is evenly spaced within the div
          }}
        >
          <h1 styles={{ margin: "0", padding: "0" }}>{product.name}</h1>
          <p
            style={{
              fontSize: "28px",
              color: "#e63946",
              margin: "0",
              padding: "0",
            }}
          >
            Price: ${product.price}
          </p>

          {/* Ratings Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0",
              padding: "0",
            }}
          >
            <span
              style={{
                color: "#ffcc00",
                marginRight: "15px",
                fontSize: "20px",
              }}
            >
              ★★★★★
            </span>
            <a href="#reviews" style={{ color: "#333", fontSize: "18px" }}>
              3 reviews
            </a>
          </div>

          {/* Product Description */}
          <p
            style={{
              margin: "0",
              padding: "0",
              color: "#555",
              lineHeight: "1.8",
              fontSize: "18px",
            }}
          >
            {product.description}
          </p>

          {/* Availability and Product Type */}
          <p style={{ margin: "0", padding: "0", fontSize: "18px" }}>
            <strong>Availability:</strong>{" "}
            {product.inStock ? "In stock" : "Out of stock"}
          </p>
          <p style={{ margin: "0", padding: "0", fontSize: "18px" }}>
            <strong>Product Type:</strong> {product.category}
          </p>

          {/* Quantity and Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
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
                  margin: "0px 20px 0px 0px",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: isInCart
                    ? "#088F8F"
                    : hoveredIcon === "cart"
                    ? "#088F8F"
                    : "#ccc",
                  transition: "color 0.3s ease",
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
                  margin: "0px 20px 0px 0px",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: isInWishlist
                    ? "#ff0000"
                    : hoveredIcon === "heart"
                    ? "#ff0000"
                    : "#ccc",
                  transition: "color 0.3s ease",
                }}
              ></i>
              {isInWishlist ? "IN WISHLIST" : "ADD TO WISHLIST"}
            </button>
          </div>

          {/* Additional Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "50px",
              marginBottom: "20px",
            }}
          >
            <button
              style={{
                padding: "16px 25px",
                backgroundColor: "#000",
                color: "#fff",
                cursor: "pointer",
                fontSize: "25px",
                display: "flex",
                marginLeft: "0px",
                alignItems: "center",
              }}
              onClick={buyNow}
            >
              <i
                className="fas fa-credit-card"
                style={{ marginRight: "10px" }}
              ></i>
              Buy Now
            </button>
          </div>
        </div>
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
    </>
  );
};

export default ProductProfile;
