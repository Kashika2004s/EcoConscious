import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BestProducts = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [currentScore, setCurrentScore] = useState({});
  const [loadedProducts, setLoadedProducts] = useState({});

  // Load persisted state from sessionStorage
  useEffect(() => {
    const savedLoadedProducts = JSON.parse(sessionStorage.getItem("loadedProducts")) || {};
    const savedCurrentScore = JSON.parse(sessionStorage.getItem("currentScore")) || {};
    setLoadedProducts(savedLoadedProducts);
    setCurrentScore(savedCurrentScore);
  }, []);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/bestproduct", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBestProducts(response.data);
      } catch (error) {
        console.error("Error fetching best products:", error);
      }
    };

    fetchBestProducts();
  }, []);

  // Save state to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem("loadedProducts", JSON.stringify(loadedProducts));
    sessionStorage.setItem("currentScore", JSON.stringify(currentScore));
  }, [loadedProducts, currentScore]);

  if (bestProducts.length === 0) {
    return <p>Loading...</p>;
  }

  const handleHover = (productId, ecoScore) => {
    if (!loadedProducts[productId]) {
      // Start loading process if not already completed
      setLoadedProducts((prev) => ({
        ...prev,
        [productId]: false,
      }));

      let currentScoreValue = 0;
      const interval = setInterval(() => {
        currentScoreValue += 1;
        if (currentScoreValue >= ecoScore) {
          clearInterval(interval);
          setLoadedProducts((prev) => ({
            ...prev,
            [productId]: true, // Mark as fully loaded
          }));
        }
        setCurrentScore((prev) => ({
          ...prev,
          [productId]: currentScoreValue,
        }));
      }, 5); // Slow loader speed
    }
  };

  return (
    <div style={styles.outer_container}>
      <h1>Best Eco-Friendly Products</h1>
      <div style={styles.container}>
        {bestProducts.map((product) => (
          <div
            key={product.id}
            style={styles.innerDiv}
            onMouseEnter={() => handleHover(product.id, product.ecoScore)}
          >
            <Link
              to={`/products/${product.category}/${product.id}`}
              style={styles.link}
            >
              <div style={styles.imageContainer}>
                <img
                  src={product.image || "https://via.placeholder.com/250"}
                  alt={product.name}
                  style={styles.image}
                />
              </div>
              <div style={styles.contentContainer}>
                <div style={styles.nameContainer}>
                  <h3 style={styles.name}>{product.name}</h3>
                  <p style={styles.price}>${product.price}</p>
                </div>
                <div style={styles.priceContainer}>
                  
                  <LoadingButton
                    ecoScore={product.ecoScore}
                    currentScore={currentScore[product.id] || 0}
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoadingButton = ({ ecoScore, currentScore }) => {
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

const styles = {
  outer_container: {
    width: "102%",
    paddingTop: "10px",
    textAlign: "center",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    width: "80%",
    justifyContent: "center",
    margin: "0 auto",
    paddingBottom: "40px",
  },
  innerDiv: {
    flex: "1 1 22%",
    minWidth: "250px",
    // width:"1000px",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ccc",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    transition: "transform 0.3s ease",
  },
  imageContainer: {
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "250px",
    objectFit: "contain",
  },
  contentContainer: {
    padding: "0px 5px 5px 15px",
    display:"flex",
    backgroundColor: "#f2f2f2",
  },
  
  name: {
    fontSize: "16px",
    color: "#333",
    // width:"150px",
  },
  
  price: {
    marginBottom: "5px",
    // marginTop: "10px",
    height: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "16px",
    color: "black",
  },
  priceContainer: {
    marginLeft:"60px",
    marginTop:"20px",
  },
  nameContainer:{
    width:"150px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
};

export default BestProducts;
