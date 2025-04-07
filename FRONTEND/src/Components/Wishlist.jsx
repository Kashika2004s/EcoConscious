import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
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

  // Fetch wishlist items from API
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/wishlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setWishlistItems(
            data.map((item) => ({
              ...item,
              price: item.price || 0,
              quantity: item.quantity || 1,
              productId: item.productId,
            }))
          );
        } else {
          setError(data.message || "Failed to fetch wishlist items");
        }
      } catch (error) {
        setError("Error fetching wishlist items");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/wishlist/remove/${itemId}`, // ✅ Correct port
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
        setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
      } else {
        setError(data.message || "Failed to remove item from wishlist");
      }
    } catch (error) {
      setError("Error removing item from wishlist");
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Quantity should not go below 1
  
    try {
      const response = await fetch(`http://localhost:3000/api/wishlist/update/${itemId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Update local state to reflect new quantity
        setWishlistItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert(data.message || "Failed to update quantity");
      }
    } catch (error) {
      alert("Error updating quantity");
    }
  };

  const handleMoveToCart = async (item) => {
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
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success(data.message); // "Item added to cart" or "Quantity updated in cart"
        fetchCartItems();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("❌ Add to cart from wishlist error:", error);
      toast.error("Something went wrong. Please try again later.");
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
    return wishlistItems
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
      <h3 style={styles.heading}>Your Wishlist Items</h3>

      {wishlistItems.length === 0 ? (
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
            onClick={() => navigate("/products")}
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
          {/* Wishlist Items */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >

{wishlistItems.map((item) => (
  <div key={item.id} className="wishlist-item" style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
    
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
      {/* <p>Quantity: {item.quantity}</p> */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <button
    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
    style={{
      padding: "5px 10px",
      fontSize: "16px",
      backgroundColor: "#eee",
      border: "1px solid #ccc",
      cursor: "pointer",
    }}
  >
    -
  </button>
  <span>{item.quantity}</span>
  <button
    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
    style={{
      padding: "5px 10px",
      fontSize: "16px",
      backgroundColor: "#eee",
      border: "1px solid #ccc",
      cursor: "pointer",
    }}
  >
    +
  </button>
</div>

      <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
      </div>

    {/* Remove Button */}
    <button 
     onClick={() => handleRemoveItem(item.id)}

      // onClick={() => handleRemoveFromWishlist(item.id)} 
      style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
    >
      Remove
    </button>
    <button
  onClick={() => handleMoveToCart(item)}
  style={{
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Move to Cart
</button>

  </div>
))}

{/* {wishlistItems.map((item) => (
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
                <strong>Items in Wishlist:</strong>{" "}
                {wishlistItems.reduce((total, item) => total + item.quantity, 0)}
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

export default Wishlist;