import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";

const TopPicks = () => {
  const [topPicks, setTopPicks] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://ecoconsciousback.onrender.com/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        // Define categories
        const categories = {
          cosmetic: "Beauty Products",
          footwear: "Footwear",
          bag: "Bags",
          clothing: "Clothing",
        };

        // Select one product from each category
        const selectedPicks = Object.keys(categories).map((key) => {
          const productsInCategory = data.filter(
            (product) =>
              product.category?.toLowerCase() === key ||
              product.category === categories[key]
          );

          if (productsInCategory.length === 0) return null; // Skip empty categories
          const randomIndex = Math.floor(
            Math.random() * productsInCategory.length
          );
          return { ...productsInCategory[randomIndex], key };
        });

        const finalPicks = selectedPicks.filter((pick) => pick); // Filter out nulls

        // Save to localStorage with timestamp
        localStorage.setItem("topPicks", JSON.stringify(finalPicks));
        localStorage.setItem("topPicksTimestamp", Date.now());

        setTopPicks(finalPicks);
      } catch (error) {
        console.error("Error fetching Top Picks:", error);
      }
    };

    // Check for cached data
    const cachedPicks = localStorage.getItem("topPicks");
    const cachedTimestamp = localStorage.getItem("topPicksTimestamp");
    const oneHour = 30 * 60 * 1000;

    if (cachedPicks && cachedTimestamp && Date.now() - cachedTimestamp < oneHour) {
      console.log("Using cached Top Picks...");
      setTopPicks(JSON.parse(cachedPicks));
    } else {
      console.log("Fetching new Top Picks...");
      fetchTopPicks();
    }
  }, []);

  return (
    <div style={styles.outer_container}>
      <h1>Top Picks for You</h1>
    <div style={styles.container}>
      {topPicks.map((product) => (
        <div
          key={product.id}
          style={styles.innerDiv}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <Link
            to={`/products/${product.category}/${product.id}`}
            style={styles.link}
          >
            <div style={styles.imageContainer}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
            </div>
            <div style={styles.contentContainer}>
              <div style={styles.nameContainer}>
                <h3 style={styles.name}>{product.name}</h3>
              </div>
              <div style={styles.priceContainer}>
                <p style={styles.price}>${product.price}</p>
              </div>
              
            </div>
          </Link>
          {/* <button
            style={{
              ...styles.viewMoreButton,
              backgroundColor:
                hoveredButton === product.id ? "green" : "rgb(175, 220, 125)",
            }}
            onMouseEnter={() => setHoveredButton(product.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            View More
          </button> */}
        </div>
      ))}
    </div>
    </div>
  );
};

const styles = {
  outer_container: {
    // backgroundColor :"#f2f2f2",
    // backgroundColor : "#f0eadd",
    width :"100%",
    paddingTop: "10px",
    textAlign : "center"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    width: "80%",
    justifyContent: "center",
    margin: "0 auto",
    paddingBottom : "40px"
    
  },
  innerDiv: {
    flex: "1 1 22%",
    minWidth: "250px",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ccc",
    // borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    transition: "transform 0.3s ease",
  },
  imageContainer: {
    backgroundColor: "#fff",
    // borderBottom: "1px solid #ddd",
  },
  image: {
    width: "100%",
    height: "250px",
    objectFit: "contain",
  },
  contentContainer: {
    padding: "15px",
    backgroundColor :"#f2f2f2"
  },
  nameContainer: {
    // marginBottom: "5px",
    height : "15px",
  },
  name: {
    fontSize: "16px",
    color: "#333",
  },
  priceContainer: {
    marginBottom: "10px",
    // marginTop : "5px",
    height : "20px",
  },
  price: {
    fontSize: "16px",
    color: "black",
  },
  descriptionContainer: {
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    color: "#555",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  viewMoreButton: {
    margin: "15px 0",
    padding: "10px 15px",
    backgroundColor: "rgb(175, 220, 125)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
};

export default TopPicks;
