import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 800); // Adjust the breakpoint as needed
    };

    // Initial check and event listener for resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigateToCategory = (category) => {
    navigate(`/products/${category}`);
  };

  const styles = {
    footer: {
      padding: "40px 20px",
      backgroundColor: "#f5f5f5",
      color: "#333",
    },
    footerContainer: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    footerColumn: {
      flex: "1",
      minWidth: "200px",
      marginBottom: "20px",
    },
    footerHeading: {
      fontSize: "16px",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    footerList: {
      listStyleType: "none",
      padding: 0,
    },
    footerListItem: {
      marginBottom: "10px",
      cursor: "pointer",
    },
    socialIcons: {
      display: "flex",
      gap: "20px",
    },
    socialIcon: {
      fontSize: "30px",
      cursor: "pointer",
    },
    link: {
      textDecoration: "none",
      color: "#333",
    },
  };

  return (
    <div>
      <div style={styles.footer}>
        <div style={styles.footerContainer}>
          {/* Categories Section */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>CATEGORIES</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem} onClick={() => navigateToCategory("Beauty Products")}>Beauty</li>
              <li style={styles.footerListItem} onClick={() => navigateToCategory("Footwear")}>Footwear</li>
              <li style={styles.footerListItem} onClick={() => navigateToCategory("Bags")}>Bags</li>
              <li style={styles.footerListItem} onClick={() => navigateToCategory("Clothing")}>Clothing</li>
            </ul>
          </div>

          {/* Customer Care Section */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>CUSTOMER CARE</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>FAQ</li>
              <li style={styles.footerListItem}>About Us</li>
              <li style={styles.footerListItem}>Feedback</li>
            </ul>
          </div>

          {/* Connect Section - Hidden on Small Screens */}
          {!isSmallScreen && (
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>CONNECT</h4>
              <div style={styles.socialIcons}>
                <a href="https://www.facebook.com" style={styles.link}>
                  <FaFacebookF style={styles.socialIcon} />
                </a>
                <a href="https://www.instagram.com" style={styles.link}>
                  <FaInstagram style={styles.socialIcon} />
                </a>
                <a href="https://www.twitter.com" style={styles.link}>
                  <FaTwitter style={styles.socialIcon} />
                </a>
                <a href="mailto:support@example.com" style={styles.link}>
                  <FaEnvelope style={styles.socialIcon} />
                </a>
              </div>
            </div>
          )}

          {/* Contact Us Section - Hidden on Small Screens */}
          {!isSmallScreen && (
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>CONTACT US</h4>
              <p>Call: +1 (xxx) xxx xxx (toll free)</p>
              <p>Email: support@example.com</p>
              <p>Mon to Fri 11 AM - 7 PM (PST)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
