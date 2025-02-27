import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = {
  container: {
    padding: "40px",
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    textAlign: "center",
    marginTop: "50px",
    marginBottom: "30px",
    color: "#333",
    width: "100%",
  },
  wishlistItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "330px",
    height: "340px",
    padding: "20px",
    border: "1px solid #e0e0e0",
    boxShadow: "2px 4px 8px #b9fbc0",
    transition: "transform 0.2s",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  wishlistItemHover: {
    transform: "scale(1.05)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  name: {
    fontSize: "16px",
    fontWeight: "700",
    color: "black",
    margin: "10px 0 5px",
  },
  price: {
    fontSize: "16px",
    color: "#555",
    fontWeight: "500",
  },
  cross: {
    position: "absolute",
    top: "3px",
    right: "20px",
    fontSize: "25px",
    cursor: "pointer",
    color: "#007F4E",
    transition: "color 0.3s ease",
  },
  addButton: {
    position: "absolute",
    top: "89%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "transparent",
    color: "black",
    border: "2px solid black",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  addButtonHover: {
    backgroundColor: "#007f4e",
    color: "white",
    transform: "translate(-50%, -55%)",
    border: "none",
  },
  emptyMessageContainer: {
    textAlign: "center",
    marginTop: "50px",
  },
  emptyMessageText: {
    fontSize: "26px",
    color: "#555",
    fontWeight:"bold",
    marginBottom: "20px",
  },
  goHomeButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/wishlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setError("Failed to fetch wishlist data");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setWishlistItems(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching wishlist data");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const addToCart = async (item) => {
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
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          quantity: 1, // Default quantity
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

  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to log in first");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error removing item: ${errorData.message}`);
      } else {
        alert("Item successfully removed from wishlist");
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      alert("Error removing item from wishlist");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Wishlist</h1>
      {wishlistItems.length > 0 ? (
        wishlistItems.map((item, index) => (
          <div
            key={item.id}
            style={
              hoveredItem === index
                ? { ...styles.wishlistItem, ...styles.wishlistItemHover }
                : styles.wishlistItem
            }
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span
              style={styles.cross}
              onClick={() => handleRemoveFromWishlist(item.productId)}
            >
              &times;
            </span>
            <Link
              to={`/products/${item.category}/${item.productId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={item.image} alt={item.name} style={styles.image} />
              <div style={styles.name}>{item.name}</div>
              <div style={styles.price}>${item.price}</div>
            </Link>
            <button
              style={
                hoveredItem === index
                  ? { ...styles.addButton, ...styles.addButtonHover }
                  : styles.addButton
              }
              onClick={() => addToCart(item)}
            >
              Add to bag
            </button>
          </div>
        ))
      ) : (
        <div style={styles.emptyMessageContainer}>
          <p style={styles.emptyMessageText}>
            Your wishlist is empty.</p><p>Explore our collection and find something amazing!
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "15px 30px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize:"20px",
              marginTop: "20px",
            }}
          >
            Explore more!
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
