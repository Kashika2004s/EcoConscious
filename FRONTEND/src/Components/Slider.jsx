import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Eco_Tote from "../public/Eco _Tote.png";
import perfume from "../public/perfume.png";
import shoe from "../public/shoe_image.png";

const Slider = () => {
  const navigate = useNavigate();

  const navigateToCategory = (category) => {
    navigate(`/products/${category}`);
  };

  const [activeIndex, setActiveIndex] = useState(0); // Default active index
  const [isMobile, setIsMobile] = useState(false); // Track screen size

  const slides = [
    {
      imageUrl: Eco_Tote,
      category: "bags",
    },
    {
      imageUrl: perfume,
      category: "Beauty Products",
    },
    {
      imageUrl: shoe,
      category: "footwear",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMobile) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize(); // Check the initial screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPreviousSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div style={styles.carouselContainer}>
      {/* Render only the active slide */}
      <div
        key={activeIndex}
        style={{
          ...styles.carouselItem,
          backgroundImage: `url(${slides[activeIndex].imageUrl})`,
          backgroundSize: isMobile ? "contain" : "cover", // For mobile, use contain to fit image
          backgroundPosition: "center",
        }}
        onClick={() => navigateToCategory(slides[activeIndex].category)} // Navigate on image click
      ></div>

      {/* Left Arrow */}
      <button onClick={goToPreviousSlide} style={styles.controlPrev}>
        &#10094;
      </button>

      {/* Right Arrow */}
      <button onClick={goToNextSlide} style={styles.controlNext}>
        &#10095;
      </button>
    </div>
  );
};

const styles = {
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: "100vh", // Full screen height
    overflow: "hidden",
    marginTop: "0", // Remove any extra margin
    cursor: "pointer",
    backgroundColor: "#f5f5f5",
  },
  carouselItem: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    color: "white",
    backgroundSize: "cover", // Default to cover for larger screens
    backgroundRepeat: "no-repeat", // Prevent repeating the image
  },
  controlPrev: {
    position: "absolute",
    top: "50%",
    left: "10px",
    fontSize: "30px",
    color: "#fff",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    zIndex: 1000,
    transform: "translateY(-50%)",
  },
  controlNext: {
    position: "absolute",
    top: "50%",
    right: "10px",
    fontSize: "30px",
    color: "#fff",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    zIndex: 1000,
    transform: "translateY(-50%)",
  },
  // Mobile Styles using media queries in external CSS or use inline styles dynamically
};

export default Slider;
