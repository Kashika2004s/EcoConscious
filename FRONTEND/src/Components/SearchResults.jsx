import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import SecondaryNavbar from "./SecondaryNavbar";

const SearchResults = () => {
  const { term } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3000/api/search/${term}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message || "Failed to fetch products"
            : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [term]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];

      // Apply filter
      if (filter) {
        filtered = filtered.filter((product) => {
          switch (filter) {
            case "low_carbon_footprint":
              return product.carbonFootprint < 5;
            case "material_sourcing_good":
              return product.materialSourcing === "good";
            case "material_sourcing_better":
              return product.materialSourcing === "better";
            case "material_sourcing_best":
              return product.materialSourcing === "best";
            case "high_recyclability":
              return product.recyclability >= 85;
            case "low_water_usage":
              return product.waterUsage === "low";
            case "high_energy_efficiency":
              return product.energyEfficiency === "high";
            case "high_biodegradability":
              return product.biodegradability > 90;
            default:
              return true;
          }
        });
      }

      // Apply sort
      if (sortOption === "price_low_high") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } else if (sortOption === "price_high_low") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [products, filter, sortOption]);
  const getFilterTag = (product) => {
    switch (filter) {
      case "low_carbon_footprint":
        return `Low Carbon Footprint: ${product.carbonFootprint}`;
      case "material_sourcing_good":
        return "Material Sourcing: Good";
      case "material_sourcing_better":
        return "Material Sourcing: Better";
      case "material_sourcing_best":
        return "Material Sourcing: Best";
      case "high_recyclability":
        return `High Recyclability: ${product.recyclability}%`;
      case "low_water_usage":
        return "Low Water Usage";
      case "high_energy_efficiency":
        return "High Energy Efficiency";
      case "high_biodegradability":
        return `High Biodegradability: ${product.biodegradability}%`;
      default:
        return "";
    }
  };


  if (loading) return <p>Loading search results...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.outerContainer}>
      <SecondaryNavbar
        currentCategory={`${term}`}
        sortOption={sortOption}
        onSortSelect={(value) => setSortOption(value)}
        onFilterSelect={(value) => setFilter(value)}
      />
      <div style={styles.app}>
        <div style={styles.productGrid}>
          {filteredProducts.length === 0 ? (
            <p>No products found for "{term}".</p>
          ) : (
            filteredProducts.map((product) => (
              <Link
                to={`/products/${product.category}/${product.id}`}
                key={product.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={styles.productCard}>
                  <img
                    src={product.image || "placeholder.png"}
                    alt={product.name}
                    style={styles.productImage}
                  />
                  <p style={styles.productName}>{product.name}</p>
                  <div style={styles.rating}>
                    {product.rating} ★★★★★ | {product.reviews} reviews
                  </div>
                  <div style={styles.price}>
                    <span>$ {product.price}</span>
                  </div>
                  {filter && (
                    <div style={styles.filterTag}>
                      {getFilterTag(product)}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    backgroundColor: "#f9f9f9",
  },
  app: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    width: "75%",
    margin: "0 auto",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1450px",
    margin: "0 auto",
  },
  productCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    overflow: "hidden",
    textAlign: "center",
    padding: "30px",
    height: "290px",
    transition: "box-shadow 0.3s ease",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    paddingBottom: "40px",
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  productName: {
    fontSize: "14px",
    color: "#777",
    margin: "5px 0",
  },
  rating: {
    fontSize: "12px",
    color: "#555",
    margin: "10px 0",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  filterTag: {
    // marginTop: "10px",
    fontSize: "14px",
    padding:'10px',
    fontStyle: "italic",
    color: "#00796b",
  },
};

export default SearchResults;
