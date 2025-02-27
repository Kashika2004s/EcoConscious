import React, { useEffect, useState, useRef } from "react";

const EnvironmentCriteria = ({ ecoScore, details }) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const boxRef = useRef(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScore((prev) => {
        if (prev >= ecoScore) {
          clearInterval(interval);
          return ecoScore;
        }
        return prev + 1;
      });
    }, 20); //20ms
    return () => clearInterval(interval);
  }, [ecoScore]);

  const handleClickOutside = (event) => {
    if (
      boxRef.current &&
      !boxRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsBoxOpen(false);
    }
  };

  const handleButtonClick = () => {
    setIsBoxOpen((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{ textAlign: "center", margin: "20px 0", position: "relative" }}
    >
      <div
        onClick={handleButtonClick}
        ref={buttonRef}
        style={{
          position: "relative",
          width: "90px",
          marginBottom: "35px",
          height: "90px",
          borderRadius: "50%",
          backgroundColor: "#e7f5e1",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <svg
          width="90"
          height="90"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            transform: "rotate(-90deg)",
          }}
        >
          <circle
            cx="45"
            cy="45"
            r="41"
            stroke="#e7f5e1"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="45"
            cy="45"
            r="41"
            stroke="#76c893"
            strokeWidth="8"
            fill="none"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * currentScore) / 100}
            style={{ transition: "stroke-dashoffset 0.2s ease" }}
          />
        </svg>
        <div
          style={{
            zIndex: "2",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#76c893",
            textAlign: "center",
          }}
        >
          <div>Eco Score</div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {currentScore}%
          </div>
        </div>
      </div>

      {isBoxOpen && (
        <div
          ref={boxRef}
          style={{
            position: "absolute",
            top: "140%",
            left: "-355px",
            transform: "translateY(-50%)",
            width: "300px",
            backgroundColor: "#ffff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 10,
            textAlign: "left",
            opacity: 1,
            visibility: isBoxOpen ? "visible" : "hidden",
            transition: "visibility 0.2s ease-in-out, opacity 0.2s ease-in-out",
            border: "2px solid #76c893",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "100%",
              top: "30%",
              transform: "translateY(-50%)",
              height: "2px",
              borderLeft: "20px solid #76c893",
              borderTop: "15px solid transparent",
              borderBottom: "15px solid transparent",
            }}
          />

          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#76c893" }}>
            Environmental Impacts
          </h3>
          <div style={{ lineHeight: "1.6", color: "#333" }}>
            <p>
              <strong>Carbon Footprint:</strong> {details.carbonFootprint}
            </p>
            <p>
              <strong>Material Sourcing:</strong> {details.materialSourcing}
            </p>
            <p>
              <strong>Recyclability:</strong> {details.recyclability}
            </p>
            <p>
              <strong>Water Usage:</strong> {details.waterUsage}
            </p>
            <p>
              <strong>Energy Efficiency:</strong> {details.energyEfficiency}
            </p>
            <p>
              <strong>Biodegradability:</strong> {details.biodegradability}
            </p>
            <p>
              <strong>Durability:</strong> {details.durability}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentCriteria;
