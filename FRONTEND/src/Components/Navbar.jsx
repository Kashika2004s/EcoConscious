import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

import { FaRegUser, FaRegHeart, FaSearch } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

  const token = localStorage.getItem("token");

  const allSuggestions = [
    "beauty", "footwear", "bags", "clothing",
    "lipstick", "heels", "sneakers", "handbags", "kurta", "saree", "t-shirt",
    "eco-friendly", "cream", "shampoo","perfume",
  ];
  

  const categoryMapping = {
    beauty: "beauty",
    footwear: "footwear",
    bags: "bags",
    clothing: "clothing",
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setShowSearch(width >= 1055);
      setIsMobile(width < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allSuggestions.filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchTerm]);

  const navigateToHome = () => navigate("/home");
  const navigateToCategory = (category) => navigate(`/products/${category}`);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    const matchedCategory = Object.keys(categoryMapping).find(
      (key) => categoryMapping[key].toLowerCase() === term
    );

    if (matchedCategory) {
      navigateToCategory(categoryMapping[matchedCategory]);
    } else if (term) {
      navigate(`/search/${term}`);
    }
    setSearchTerm("");
    setFilteredSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    const matchedCategory = categoryMapping[suggestion];
    if (matchedCategory) {
      navigateToCategory(matchedCategory);
    } else {
      navigate(`/search/${suggestion}`);
    }
    setFilteredSuggestions([]);
  };

  const styles = {
    navbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#ffffff",
      zIndex: 1000,
    },
    logoContainer: { display: "flex", alignItems: "center", cursor: "pointer" },
    logo: { height: "40px" },
    heading: {
      marginLeft: "10px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#3e4152",
      cursor: "pointer",
    },
    menuContainer: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      gap: "30px",
      fontSize: "16px",
      fontWeight: "500",
      color: "#3e4152",
    },
    menuItem: {
      cursor: "pointer",
      backgroundColor: "transparent",
      border: "none",
      color: "black",
      fontSize: "14px",
      fontWeight: "600",
    },
    searchContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      backgroundColor: "#f5f5f6",
      marginRight: "70px",
      padding: "10px 20px",
      width: "500px",
      position: "relative",
    },
    searchInputRow: {
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    searchInput: {
      border: "none",
      backgroundColor: "transparent",
      outline: "none",
      width: "100%",
      fontSize: "14px",
      color: "#3e4152",
    },
    suggestionsList: {
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      backgroundColor: "white",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      zIndex: 1002,
      marginTop: "5px",
      borderRadius: "4px",
    },
    suggestionItem: {
      padding: "10px",
      cursor: "pointer",
      fontSize: "14px",
      borderBottom: "1px solid #eee",
    },
    iconsContainer: {
      display: "flex",
      alignItems: "center",
      gap: "40px",
      marginRight: "40px",
    },
    iconWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: "14px",
      color: "#3e4152",
      cursor: "pointer",
      height: "100%",
      justifyContent: "center",
    },
    icon: { fontSize: "20px" },
    icontext: {
      fontSize: "14px",
      color: "black",
      fontWeight: "500",
    },
    profileMenu: {
      position: "absolute",
      top: "60px",
      right: "110px",
      width: "200px",
      backgroundColor: "#ffffff",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      zIndex: 1001,
    },
    profileMenuItem: {
      padding: "10px 20px",
      fontSize: "14px",
      color: "#333",
      cursor: "pointer",
      borderBottom: "1px solid #f0f0f0",
    },
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logoContainer} onClick={navigateToHome}>
      {/* <img src="/logo.png" alt="Logo" style={styles.logo}/> */}

        <img src={logo} alt="Logo" style={styles.logo} />
        <span style={styles.heading}>Eco-Conscious</span>
      </div>

      {/* Categories */}
      <div
        style={{
          ...styles.menuContainer,
          display: isMobile ? (isMenuOpen ? "block" : "none") : "flex",
        }}
      >
        {["beauty", "footwear", "bags", "clothing"].map((cat) => (
          <button
            key={cat}
            style={styles.menuItem}
            onClick={() => navigateToCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Search with Suggestions */}
      {showSearch && (
        <form style={styles.searchContainer} onSubmit={handleSearch}>
          <div style={styles.searchInputRow}>
            <FaSearch style={{ cursor: "pointer", marginRight: "10px" }} />
            <input
              type="text"
              placeholder="Search for products, and more"
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredSuggestions.length > 0 && (
            <div style={styles.suggestionsList}>
              {filteredSuggestions.map((s, i) => (
                <div
                  key={i}
                  style={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </form>
      )}

      {/* Icons */}
      <div style={styles.iconsContainer}>
        <div
          style={styles.iconWrapper}
          onMouseEnter={() => setIsProfileMenuVisible(true)}
          onMouseLeave={() => setIsProfileMenuVisible(false)}
        >
          <FaRegUser style={styles.icon} />
          <span style={styles.icontext}>Profile</span>

          {isProfileMenuVisible && (
            <div style={styles.profileMenu}>
              <div style={styles.profileMenuItem} onClick={() => navigate("/profile")}>Account</div>
              <div style={styles.profileMenuItem} onClick={() => navigate("/wishlist")}>Wishlist</div>
              <div style={styles.profileMenuItem} onClick={() => navigate("/order-history")}>Order History</div>
              <div style={styles.profileMenuItem} onClick={() => navigate("/edit")}>Edit Account</div>
              <div style={styles.profileMenuItem} onClick={logout}>Logout</div>
            </div>
          )}
        </div>

        <div style={styles.iconWrapper} onClick={() => navigate("/wishlist")}>
          <FaRegHeart style={styles.icon} />
          <span style={styles.icontext}>Wishlist</span>
        </div>

        <div style={styles.iconWrapper} onClick={() => navigate("/cart")}>
          <FiShoppingBag style={styles.icon} />
          <span style={styles.icontext}>Bag</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
