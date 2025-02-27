import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../public/logo.png";
import { FaRegUser, FaRegHeart, FaSearch } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setShowSearch(width >= 1055); 
      setIsMobile(width < 768);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  

  const navigateToHome = () => navigate("/home");
  const navigateToCategory = (category) => navigate(`/products/${category}`);

  const logout=()=>{
    localStorage.removeItem("token");
    navigate("/");
  }

  const categoryMapping = {
    beauty: "beauty",
  footwear: "footwear",
  bags: "bags",
  clothing: "clothing",
};
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  
    // Check if the entered term matches a category
    const matchedCategory = Object.keys(categoryMapping).find((key) => 
      categoryMapping[key].toLowerCase() === normalizedSearchTerm
    );
  
    if (matchedCategory) {
      navigateToCategory(categoryMapping[matchedCategory]);
    } else if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`); // Default search behavior
      }
};
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


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
    menuItem: { cursor: "pointer", backgroundColor: "transparent", border: "none", color: "black", fontSize: "14px", fontWeight: "600" },
    searchContainer: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f5f5f6",
      padding: "10px 20px",
      marginRight: "70px",
      width: "500px",
    },
    searchInput: { border: "none", backgroundColor: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "#3e4152" },
    iconsContainer: { display: "flex", alignItems: "center", gap: "40px", marginRight: "40px" },
    iconWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: "14px",
      color: "#3e4152",
      cursor: "pointer",
      height: "100%",
      justifyContent: "center",
      borderBottom: "2px solid transparent",
      transition: "border-bottom 0.3s ease",
    },
    iconWrapperHover: {
      borderBottom: "2px solid #007F4E",
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
    mobileMenu: {
      display: "block",
      position: "absolute",
      top: "60px",
      left: 0,
      backgroundColor: "#ffffff",
      width: "100%",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      zIndex: 1001,
    },
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo and Eco-Conscious Text */}
      <div style={styles.logoContainer} onClick={navigateToHome}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <span style={styles.heading}>Eco-Conscious</span>
      </div>

      {/* Navigation Links */}
      <div
        style={{
          ...styles.menuContainer,
          display: isMobile ? (isMenuOpen ? "block" : "none") : "flex",
        }}
      >
        <button style={styles.menuItem} onClick={() => navigateToCategory("beauty")}>
          Beauty
        </button>
        <button style={styles.menuItem} onClick={() => navigateToCategory("footwear")}>
          Footwear
        </button>
        <button style={styles.menuItem} onClick={() => navigateToCategory("bags")}>
          Bags
        </button>
        <button style={styles.menuItem} onClick={() => navigateToCategory("clothing")}>
          Clothing
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <form style={styles.searchContainer} onSubmit={handleSearch}>
          <FaSearch style={{ cursor: "pointer" }} />
          <input
            type="text"
            placeholder="Search for products, and more"
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      {/* Icons */}
      <div style={styles.iconsContainer}>
        <div
          style={{ ...styles.iconWrapper }}
          onMouseEnter={() => setIsProfileMenuVisible(true)}
          onMouseLeave={() => setIsProfileMenuVisible(false)}
        >
          <FaRegUser style={styles.icon} />
          <span style={styles.icontext}>Profile</span>

          {/* Dropdown Menu */}
          {isProfileMenuVisible && (
            <div style={styles.profileMenu}>
              <div style={styles.profileMenuItem} onClick={() => navigate("/profile")}>
                Account
              </div>
              <div style={styles.profileMenuItem} onClick={() => navigate("/wishlist")}>
                Wishlist
              </div>
              <div style={styles.profileMenuItem} onClick={() => navigate("/order-history")}>
                Order History
              </div>
              <div style={styles.profileMenuItem} onClick={() => navigate("/edit")}>
                Edit Account
              </div>
              <div style={styles.profileMenuItem} onClick={logout}>
                Logout
              </div>
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