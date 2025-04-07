import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const styles = {
    heading: {
      fontSize: "32px",
      textAlign: "center",
      marginTop: "5px",
      marginBottom: "50px",
      color: "#333",
      width: "100%",
    },
  };

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cart", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCartItems(
            data.map((item) => ({
              ...item,
              price: item.price || 0,
              quantity: item.quantity || 1,
              productId: item.productId,
            }))
          );
        } else {
          setError(data.message || "Failed to fetch cart items");
        }
      } catch (error) {
        setError("Error fetching cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cart/remove/${itemId}`, // ✅ Correct port
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      } else {
        setError(data.message || "Failed to remove item from cart");
      }
    } catch (error) {
      setError("Error removing item from cart");
    }
  };
  
  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/order/place-order",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        navigate(`/order/${data.order.id}`);
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      alert("Error placing order. Please try again.");
    }
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "90px 90px 0px 90px", maxWidth: "100%", marginBottom: "50px" }}>
      <h3 style={styles.heading}>Your Cart Items</h3>

      {cartItems.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "100px",
            textAlign: "center",
          }}
        >
          <h1>Hey, it feels so light!</h1>
          <p>There is nothing in your bag. Let's add some items.</p>
          <button
            onClick={() => navigate("/wishlist")}
            style={{
              padding: "15px 30px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              borderRadius: "5px",
              marginTop: "20px",
            }}
          >
            Explore Wishlist!
          </button>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          {/* Cart Items */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >

{cartItems.map((item) => (
  <div key={item.id} className="cart-item" style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
    
    {/* Product Image */}
    <img 
      src={item.image} 
      alt={item.name} 
      style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '16px' }} 
    />

    {/* Product Info */}
    <div style={{ flex: 1 }}>
      <h3>{item.name}</h3>
      <p>Price: ₹{item.price}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Total: ₹{item.totalPrice}</p>
    </div>

    {/* Remove Button */}
    <button 
     onClick={() => handleRemoveItem(item.id)}

      // onClick={() => handleRemoveFromCart(item.id)} 
      style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
    >
      Remove
    </button>
  </div>
))}

{/* {cartItems.map((item) => (
  <div key={item.id}>
    <h3>{item.name}</h3>
    <p>Price: ${item.price}</p>
    <p>Quantity: {item.quantity}</p>
    <p>Total: ${item.totalPrice}</p>
  </div>
))} */}

          </div>

          {/* Order Summary */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              marginLeft: "20px",
              height: "auto",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "30px" }}>
              Order Summary
            </h3>
            <div style={{ marginBottom: "10px" }}>
              <p style={{ fontSize: "18px", margin: "20px 0" }}>
                <strong>Items in Cart:</strong>{" "}
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </p>
              <p style={{ fontSize: "18px", margin: "5px 0" }}>
                <strong>Total Price:</strong> ${getTotalPrice()}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "18px", fontWeight: "600" }}>
                Estimated Delivery Time: 4-7 days
              </p>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                padding: "15px 30px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                width: "100%",
                fontSize: "18px",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;