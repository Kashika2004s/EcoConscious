import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingButton from "./LoadingButton"; // if you're using a separate ecoScore button
import logo from "../assets/logo.png"; // path as per your logo
import PropTypes from "prop-types";
const Alternative = ({ productId, category }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3000/api/alternatives/${category}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        

        setAlternatives(response.data);
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message || "Failed to fetch alternatives"
            : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId && category) {
      fetchAlternatives();
    }
  }, [category, productId]);


  const toggleDrawer = () => setShowDrawer(!showDrawer);
  const closeDrawer = () => setShowDrawer(false);

  return (
    <div style={styles.container}>
      <button
        style={styles.logoButton}
        onClick={toggleDrawer}
        aria-label="Open Alternatives Drawer"
      >
        <img src={logo} alt="Logo" style={styles.logoImage} />
      </button>

      <div
        style={{
          ...styles.drawer,
          right: showDrawer ? 0 : "-400px",
        }}
      >
        <button
          style={styles.closeButton}
          onClick={closeDrawer}
          aria-label="Close Drawer"
        >
          &times;
        </button>
        <h3 style={styles.title}>Alternatives</h3>

        {!loading && alternatives.length === 0 ? (
          <div className="congratulationsText">
            <p>
              🎉 Congratulations, you've selected one of the most eco-friendly
              options available!
            </p>
          </div>
        ) : (


          <div style={styles.alternativeGrid}>
  {alternatives.map((product) => (
    <Link
      to={`/products/${product.category}/${product.id}`}
      key={product.id}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={closeDrawer}
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
  ))}
</div>

        )}
      </div>

      {showDrawer && <div style={styles.overlay} onClick={closeDrawer}></div>}
    </div>
  );
};

const EcoScoreCircle = ({ ecoScore }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let score = 0;
    const interval = setInterval(() => {
      score += 1;
      if (score >= ecoScore) clearInterval(interval);
      setCurrentScore(score);
    }, 5);
    return () => clearInterval(interval);
  }, [ecoScore]);

  return (
    <div
      style={{
        position: "relative",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="50"
        height="50"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#eeeeee"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#76c893"
          strokeWidth="4"
          fill="none"
          strokeDasharray="125.6"
          strokeDashoffset={125.6 - (125.6 * currentScore) / 100}
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
      </svg>
      <div
        style={{
          zIndex: "2",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#76c893",
        }}
      >
        {currentScore}%
      </div>
    </div>
  );
};

Alternative.propTypes = {
  productId: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

const styles = {
  container: {
    position: "relative",
  },
  logoButton: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
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
    zIndex: 1100,
  },
  logoImage: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: "-500px",
    width: "400px",
    height: "100%",
    backgroundColor: "#e7f5e1",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    transition: "right 0.6s ease-in-out",
    zIndex: 1000,
    overflowY: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "80px",
    left: "5px",
    background: "transparent",
    border: "none",
    fontSize: "30px",
    cursor: "pointer",
    color: "#333",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  alternativeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  alternativeCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  alternativeImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  productName: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "10px",
  },
  productPrice: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  productDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 500,
  },
};

export default Alternative;