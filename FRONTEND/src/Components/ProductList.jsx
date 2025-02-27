import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import SecondaryNavbar from "./SecondaryNavbar";
import Navbar from "./Navbar";

const ProductList = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categoryMapping = {
    beauty: "Beauty Products",
    footwear: "Footwear",
    bags: "Bags",
    clothing: "Clothing",
  };
  const normalizedCategory = categoryMapping[category?.toLowerCase()] || category;

  useEffect(() => {
    setFilter("");
    setSortOption("");
    setSearchTerm("");
  }, [normalizedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized. Please log in.");
        }

        const response = await axios.get("http://localhost:3000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data = response.data;
        if (normalizedCategory !== "All") {
          data = data.filter((product) => product.category === normalizedCategory);
        }

        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [normalizedCategory]);

  const processProducts = () => {
    return products
      .filter((product) => {
        if (!filter) return true;
        const conditions = {
          low_carbon_footprint: product.carbonFootprint < 5,
          material_sourcing_good: product.materialSourcing === "good",
          material_sourcing_better: product.materialSourcing === "better",
          material_sourcing_best: product.materialSourcing === "best",
          high_recyclability: product.recyclability >= 85,
          low_water_usage: product.waterUsage === "low",
          high_energy_efficiency: product.energyEfficiency === "high",
          high_biodegradability: product.biodegradability > 90,
        };
        return conditions[filter];
      })
      .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortOption === "price_low_high") return a.price - b.price;
        if (sortOption === "price_high_low") return b.price - a.price;
        return 0;
      });
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return (
    <div>
      <p>Error fetching products: {error.message}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  const filterProducts = (products) => {
    let filtered = products;

    if (filter) {
      filtered = filtered.filter((product) => {
        const filterConditions = {
          low_carbon_footprint: product.carbonFootprint < 5,
          material_sourcing_good: product.materialSourcing === "good",
          material_sourcing_better: product.materialSourcing === "better",
          material_sourcing_best: product.materialSourcing === "best",
          high_recyclability: product.recyclability >= 85,
          low_water_usage: product.waterUsage === "low",
          high_energy_efficiency: product.energyEfficiency === "high",
          high_biodegradability: product.biodegradability > 90,
        };
        return filterConditions[filter] || true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const sortProducts = (products) => {
    let sortedProducts = [...products];

    if (sortOption === "price_low_high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_high_low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    return sortedProducts;
  };

  const processedProducts = sortProducts(filterProducts(products));

  const getFilterTag = (product) => {
    const filterTags = {
      low_carbon_footprint: `Low Carbon Footprint: ${product.carbonFootprint}`,
      material_sourcing_good: "Material Sourcing: Good",
      material_sourcing_better: "Material Sourcing: Better",
      material_sourcing_best: "Material Sourcing: Best",
      high_recyclability: `High Recyclability: ${product.recyclability}%`,
      low_water_usage: "Low Water Usage",
      high_energy_efficiency: "High Energy Efficiency",
      high_biodegradability: `High Biodegradability: ${product.biodegradability}%`,
    };

    return filterTags[filter] || "";
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products: {error.message}</p>;

  return (
    <div style={styles.outerContainer}>
      <SecondaryNavbar
        currentCategory={normalizedCategory}
        sortOption={sortOption}
        onSortSelect={setSortOption}
        onFilterSelect={setFilter}
      />
      <div style={styles.app}>
        <div style={styles.productGrid}>
          {processedProducts.length === 0 ? (
            <p>No products match the selected criteria.</p>
          ) : (
            processedProducts.map((product) => (
              <Link
                to={`/products/${category}/${product.id}`}
                key={product.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={styles.productCard}>
                  <img src={product.image} alt={product.name} style={styles.productImage} />
                  <h3 style={styles.productBrand}>{product.brand}</h3>
                  <p style={styles.productName}>{product.name}</p>
                  <div style={styles.rating}>
                    {product.rating} ★★★★★ | {product.reviews} reviews
                  </div>
                  <div style={styles.price}>
                    <span>$ {product.price}</span>
                  </div>
                  {filter && <div style={styles.filterTag}>{getFilterTag(product)}</div>}
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
  outerContainer: { backgroundColor: "#f9f9f9" },
  app: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    width: "80%",
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
    textAlign: "center",
    padding: "30px",
    height: "320px",
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
  productBrand: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#333",
  },
  productName: {
    fontSize: "16px",
    color: "black",
    margin: "5px 0",
    fontWeight: "700",
  },
  rating: {
    fontSize: "12px",
    color: "#555",
    margin: "10px 0",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#777",
  },
  filterTag: {
    fontSize: "14px",
    padding: "10px",
    fontStyle: "italic",
    color: "#00796b",
  },
};

export default ProductList;
