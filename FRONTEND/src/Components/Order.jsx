import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  container: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#e3efe9",
    fontFamily: "'Arial', sans-serif",
  },
  footer: {
    padding: "10px",
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
  },
  heading: {
    fontSize: "28px",
    marginTop: "70px",
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "bold",
  },
  responsiveContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  itemContainer: {
    flex: "1 1 calc(50% - 20px)",
    maxWidth: "calc(40% - 22px)",
    display: "flex",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  imageContainer: {
    flex: 1,
    maxWidth: "150px",
    margin: "10px",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  productDetails: {
    flex: 3,
    marginLeft: "20px",
    color: "#333",
  },
  productName: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "15px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    marginBottom: "8px",
  },
};

const Order = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/order/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching order data");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        setError("Error fetching order data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Your Order Details</h3>
      <div style={styles.responsiveContainer}>
        {order.items.map((item, index) => {
          const product = item.productId || {}; // Fallback to an empty object
          return (
            <div key={index} style={styles.itemContainer}>
              {/* Left side - Image */}
              <div style={styles.imageContainer}>
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name || "No image available"}
                  style={styles.image}
                />
              </div>

              {/* Right side - Product Details */}
              <div style={styles.productDetails}>
                <p style={styles.productName}>
                  {product.name || "Product Unavailable"}
                </p>
                <p style={styles.text}>
                  <strong>Quantity:</strong> {item.quantity || "N/A"}
                </p>
                <p style={styles.text}>
                  <strong>Price:</strong> ${product.price || "N/A"}
                </p>
                <p style={styles.text}>
                  <strong>Total: </strong>${product.price} * {item.quantity} ={" "}
                  <strong>
                    {" "}
                    {product.price
                      ? `$${(product.price * item.quantity).toFixed(2)}`
                      : "N/A"}
                  </strong>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
