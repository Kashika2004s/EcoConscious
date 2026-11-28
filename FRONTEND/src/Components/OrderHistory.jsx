
import React, { useState, useEffect } from "react";

const API_URL = "https://ecoconscious.onrender.com";

const formatPrice = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
};

const styles = {
    container: {
        flex: 1,
        padding: "30px",
        backgroundColor: "#f9fafb",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        marginTop: "80px",
        fontSize: "32px",
        textAlign: "center",
        marginBottom: "30px",
        fontWeight: "700",
        color: "#333",
    },
    itemsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
    },
    orderContainer: {
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        width: "80%",
        maxWidth: "900px",
        margin: "20px 0",
    },
    itemContainer: {
        display: "flex",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fafafa",
        marginBottom: "15px",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
    },
    imageContainer: {
        width: "150px",
        height: "150px",
        overflow: "hidden",
        borderRadius: "10px",
        flexShrink: 0,
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    productDetails: {
        flex: 1,
        color: "black",
    },
    productName: {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#222",
    },
    text: {
        fontSize: "16px",
        color: "black",
        fontWeight: "550",
        marginBottom: "8px",
    },
    feedbackForm: {
        width: "100%",
        maxWidth: "400px",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        resize: "vertical",
        fontSize: "16px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxSizing: "border-box",
    },
    fileInput: {
        padding: "5px",
    },
    submitButton: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    giveFeedbackButton: {
        width: "200px",
        marginTop: "10px",
        padding: "10px 20px",
        backgroundColor: "#007f4e",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

// FEEDBACK FORM
const FeedbackForm = ({ orderId, onSubmit }) => {
    const [comments, setComments] = useState("");
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comments.trim()) {
            alert("Please enter your feedback.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please log in first.");
            return;
        }

        const formData = new FormData();
        formData.append("orderId", orderId);
        formData.append("comments", comments.trim());

        if (photo) {
            formData.append("photo", photo);
        }

        try {
            setSubmitting(true);

            const response = await fetch(`${API_URL}/api/feedback`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit feedback");
            }

            alert("Feedback submitted successfully!");

            setComments("");
            setPhoto(null);

            onSubmit();

        } catch (error) {
            console.error("Feedback Error:", error);
            alert(error.message || "Unable to submit feedback.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.feedbackForm}>
            <textarea
                placeholder="Write your feedback here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={styles.textarea}
                rows="4"
                required
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                style={styles.fileInput}
            />

            <button
                type="submit"
                style={styles.submitButton}
                disabled={submitting}
            >
                {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
        </form>
    );
};

// ORDER HISTORY COMPONENT
const OrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFeedback, setShowFeedback] = useState({});

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Please log in to view your orders.");
                }

                const response = await fetch(
                    `${API_URL}/api/order-history`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch order history"
                    );
                }

                setOrderHistory(
                    Array.isArray(data.orders) ? data.orders : []
                );

            } catch (err) {
                console.error("Order History Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    const toggleFeedbackForm = (orderId) => {
        setShowFeedback((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    if (loading) {
        return <div style={styles.container}>Loading orders...</div>;
    }

    if (error) {
        return (
            <div style={styles.container}>
                <h3 style={styles.heading}>{error}</h3>
            </div>
        );
    }

    if (orderHistory.length === 0) {
        return (
            <div style={styles.container}>
                <h3 style={styles.heading}>No orders found</h3>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.heading}>Your Order History</h3>

            <div style={styles.itemsContainer}>
                {orderHistory.map((order) => (
                    <div
                        key={order.id}
                        style={styles.orderContainer}
                    >
                        <div style={styles.productDetails}>
                            <h4>Order ID: {order.id}</h4>

                            <p style={styles.text}>
                                <strong>Order Date: </strong>
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </p>

                            <p style={styles.text}>
                                <strong>Total Price: </strong>
                                ${formatPrice(order.totalPrice)}
                            </p>
                        </div>

                        <div>
                            {(Array.isArray(order.items) ? order.items : []).map(
                                (item, index) => {
                                    const product = item.productId || {};

                                    const productPrice = Number(
                                        item.price ?? product.price ?? 0
                                    );

                                    const quantity = Number(item.quantity) || 0;

                                    const itemTotal =
                                        productPrice * quantity;

                                    return (
                                        <div
                                            key={`${order.id}-${product._id || index}`}
                                            style={styles.itemContainer}
                                        >
                                            <div style={styles.imageContainer}>
                                                <img
                                                    src={
                                                        product.image ||
                                                        "https://via.placeholder.com/150"
                                                    }
                                                    alt={
                                                        product.name ||
                                                        "Product"
                                                    }
                                                    style={styles.image}
                                                />
                                            </div>

                                            <div style={styles.productDetails}>
                                                <p style={styles.productName}>
                                                    {product.name ||
                                                        "Product unavailable"}
                                                </p>

                                                <p style={styles.text}>
                                                    <strong>Quantity: </strong>
                                                    {quantity}
                                                </p>

                                                <p style={styles.text}>
                                                    <strong>Price: </strong>
                                                    ${formatPrice(productPrice)}
                                                </p>

                                                <p style={styles.text}>
                                                    <strong>Total: </strong>
                                                    ${formatPrice(itemTotal)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        <button
                            onClick={() => toggleFeedbackForm(order.id)}
                            style={styles.giveFeedbackButton}
                        >
                            {showFeedback[order.id]
                                ? "Hide Feedback Form"
                                : "Give Feedback"}
                        </button>

                        {showFeedback[order.id] && (
                            <FeedbackForm
                                orderId={order.id}
                                onSubmit={() => {
                                    setShowFeedback((prev) => ({
                                        ...prev,
                                        [order.id]: false,
                                    }));
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
