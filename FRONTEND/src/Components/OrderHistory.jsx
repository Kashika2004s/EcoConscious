import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f9fafb',
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    marginTop: '80px',
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: '700',
    color: '#333',
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '900px',
    margin: '20px 0',
  },
  orderHeader: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#444',
  },
  orderDetails: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '15px',
  },
  itemContainer: {
    display: 'flex',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fafafa',
    marginBottom: '15px',
    alignItems: 'center',
    gap: '20px',
  },
  imageContainer: {
    width: '150px',
    height: '150px',
    overflow: 'hidden',
    borderRadius: '10px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productDetails: {
    flex: 1,
    color: 'black',
  },
  productName: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#222',
  },
  text: {
    fontSize: '16px',
    color: 'black',
    fontWeight: '550',
    marginBottom: '8px',
  },
  totalPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    marginTop: '10px',
  },
  feedbackForm: {
    width:'400px',
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    resize: 'none',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  fileInput: {
    padding: '5px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  giveFeedbackButton: {
    width:"200px",
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007f4e',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const FeedbackForm = ({ orderId, onSubmit }) => {
  const [comments, setComments] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('comments', comments);
    formData.append('photo', photo); // photo should be the File object

    try {
      const response = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const data = await response.json();
      alert(data.message);
      setTimeout(() => {
        onSubmit(); 
      }, 50);
    } catch (error) {
      console.error(error);
      alert('An error occurred: ' + error.message);
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
      />
      <input
        type="file"
        onChange={(e) => setPhoto(e.target.files[0])}
        style={styles.fileInput}
      />
      <button type="submit" style={styles.submitButton}>
        Submit Feedback
      </button>
    </form>
  );
};

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false); 

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/order-history', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(errorData);
          throw new Error('Failed to fetch order history');
        }

        const data = await response.json();
        setOrderHistory(data.orders);
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const toggleFeedbackForm = () => {
    setShowFeedback((prev) => !prev); // Toggle feedback form visibility
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (orderHistory.length === 0)
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>No orders found</h3>
      </div>
    );

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Your Order History</h3>
      <div style={styles.itemsContainer}>
        {orderHistory.map((order) => (
          <div key={order.id} style={styles.orderContainer}>
            <div style={styles.productDetails}>
              <h4>Order ID: {order.id}</h4>
              <p style={styles.text}>
                <strong>Order Date: </strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p style={styles.text}>
                <strong>Total Price: </strong> ${order.totalPrice.toFixed(2)}
              </p>
              <br />
            </div>
            <div>
              {order.items.map((item) => {
                const product = item.productId || {}; // Fallback to an empty object
                return (
                  <div key={product.id || item.id} style={styles.itemContainer}>
                    <div style={styles.imageContainer}>
                      <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name || 'Image not available'}
                        style={styles.image}
                      />
                    </div>
                    <div style={styles.productDetails}>
                      <p style={styles.productName}>{product.name || 'Product unavailable'}</p>
                      <p style={styles.text}>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p style={styles.text}>
                        <strong>Price:</strong> ${product.price || 'N/A'}
                      </p>
                      <p style={styles.text}>
                        <strong>Total: </strong>
                        ${(product.price ? item.quantity * product.price : 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={toggleFeedbackForm}
              style={styles.giveFeedbackButton}
            >
              {showFeedback ? 'Hide Feedback Form' : 'Give Feedback'}
            </button>
            {showFeedback && (
              <FeedbackForm
                orderId={order.id}
                onSubmit={() => {
                  setShowFeedback(false); // Hide the feedback form after submitting
                  console.log('Feedback submitted for order', order.id);
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