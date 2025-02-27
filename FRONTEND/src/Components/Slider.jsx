import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Eco_Tote from "../public/Eco _Tote.png";
import perfume from "../public/perfume.png";
import shoe from "../public/shoe_image.png";
import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";

const Slider = () => {
  const navigate = useNavigate();

  const navigateToCategory = (category) => {
    navigate(`/products/${category}`);
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      imageUrl: Eco_Tote,
      buttonStyle: { top: "68.5%", left: "58.5%", backgroundColor: "#8e9c77" },
      buttonText: "Explore !",
      textStyle: { color: "white", fontSize: "25px", fontWeight: "bold" },
      category: "bags",
    },
    {
      imageUrl: perfume,
      buttonStyle: { top: "66%", left: "37%", backgroundColor: "white" },
      buttonText: "Find Out !",
      textStyle: { color: "black", fontSize: "25px" },
      category: "Beauty Products",
    },
    {
      imageUrl: shoe,
      buttonStyle: { bottom: "4.5%", left: "40.15%", backgroundColor: "black" },
      buttonText: "Shop Now !",
      category: "footwear",
    },
  ];

  useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      },3000);
      return () => clearInterval(interval);
    }, [slides.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        goToPreviousSlide();
      } else if (event.key === "ArrowRight") {
        goToNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goToPreviousSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div
      style={styles.carouselContainer}
      onClick={(e) => {
        if (e.clientX < window.innerWidth / 2) {
          goToPreviousSlide();
        } else {
          goToNextSlide();
        }
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            ...styles.carouselItem,
            display: index === activeIndex ? "block" : "none",
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            style={{
              ...styles.ctaButton,
              ...slide.buttonStyle,
            }}
            onClick={() => navigateToCategory(slide.category)}
          >
            <span style={slide.textStyle}>{slide.buttonText}</span>
          </button>
        </div>
      ))}
      <button
        onClick={goToPreviousSlide}
        style={styles.controlPrev}
      >
        &#10094;
      </button>
      <button
        onClick={goToNextSlide}
        style={styles.controlNext}
      >
        &#10095;
      </button>
    </div>
  );
};

const styles = {
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: "calc(100vh - 85px)",
    overflow: "hidden",
    marginTop: "70px",
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
  },
  ctaButton: {
    position: "absolute",
    padding: "15px 30px",
    fontSize: "1.2rem",
    color: "white",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width : "350px",
    height : "84px"
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
  },
};

export default Slider;
