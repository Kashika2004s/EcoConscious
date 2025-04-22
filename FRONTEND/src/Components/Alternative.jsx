import React, { useEffect, useState } from "react";
import logo from "./download.png";
import axios from "axios";
import "./Styles/congratulationsText.css";
import { Link, useNavigate } from "react-router-dom";

const Alternative = ({ productId, category }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/alternatives/${category}/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.message) {
          setAlternatives([]);
        } else {
          setAlternatives(response.data.alternatives || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch alternatives");
      } finally {
        setLoading(false);
      }
    };

    if (productId && category) {
      fetchAlternatives();
    }
  }, [category, productId]);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div style={styles.container}>
      <div style={showModal ? styles.blurredContent : undefined}>
        <button style={styles.logoButton} onClick={toggleModal}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
        </button>
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.closeButton} onClick={toggleModal}>
              &#x2715;
            </button>
            <h3 style={styles.title}>Alternatives</h3>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div style={styles.alternativeGrid}>
              {alternatives.length === 0 ? (
                <div className="congratulationsText">
                  <p>🎉 Congratulations, you've selected the most eco-friendly option!</p>
                </div>
              ) : (
                alternatives.map((product) => (
                  <Link
                    to={`/products/${product.category}/${product.id}`}
                    key={product.id}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => setShowModal(false)}
                  >
                    <div style={styles.alternativeCard}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.alternativeImage}
                      />
                      <h3 style={styles.productName}>{product.name}</h3>
                      <div style={styles.productDetails}>
                        <p style={styles.productPrice}>${product.price}</p>
                        <LoadingButton ecoScore={product.ecoScore} />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingButton = ({ ecoScore }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= ecoScore) clearInterval(interval);
      setCurrentScore(current);
    }, 5);
    return () => clearInterval(interval);
  }, [ecoScore]);

  const size = 55;
  const radius = 25;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", top: "0", left: "0", transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eee"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#76c893"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * currentScore) / 100}
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
      </svg>
      <div
        style={{
          zIndex: 2,
          fontSize: "12px",
          fontWeight: "bold",
          color: "#76c893",
        }}
      >
        {currentScore.toFixed(0)}%
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
  },
  logoButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.3)",
  },
  logoImage: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    width: "70%",
    maxWidth: "800px",
    zIndex: 1010,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#333",
  },
  blurredContent: {
    filter: "blur(8px)",
    transition: "filter 0.3s ease",
    pointerEvents: "none",
    userSelect: "none",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "40px",
    color: "#333",
    textAlign: "center",
  },
  alternativeGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  alternativeCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    width: "300px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    flexBasis: "220px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  alternativeImage: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  productName: {
    fontSize: "18px",
    color: "#333",
    margin: "0px 0px",
  },
  productPrice: {
    color: "#4CAF50",
    fontWeight: "bold",
    margin: "0px 0px",
  },
  congratsCard: {
  height: "120px", /* reduced from 180px */
  backgroundColor: "#f1fdf4",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "500px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
  padding: "10px 20px",
},
};

export default Alternative;
