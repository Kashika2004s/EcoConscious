import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const username = e.target.username.value;
    const fullname = e.target.full_name.value; // Changed from full_name to fullname
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirm_password.value; // Changed from confirm_password to confirmPassword
    const address = e.target.address.value;
    const phoneNumber = e.target.phone_number.value; // Changed from phone_number to phoneNumber
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          fullname, // Updated key
          email,
          password,
          confirmPassword, // Updated key
          address,
          phoneNumber, // Updated key
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
  
      const data = await response.json();
      console.log("Signup successful:", data);
      setIsSignedUp(true);
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message);
    }
  };
  
  


  const styles = {
    mainbox: {
      backgroundColor: "#f2f2f2",
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    loginBox: {
      padding: "40px",
      boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      width: "100%",
      maxWidth: "600px",
      backgroundColor: "#ffffff",
    },
    inputGroupContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "20px",
    },
    halfWidthInputGroupContainer: {
      display: "flex",
      gap: "20px",
      width: "100%",
    },
    fullWidthInputGroup: {
      flexBasis: "100%",
      marginBottom: "20px",
      textAlign: "left",
      borderBottom: "1px solid #ccc",
    },
    halfWidthInputGroup: {
      flex: "1",
      textAlign: "left",
      borderBottom: "1px solid #ccc",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontSize: "16px",
      color: "#444",
    },
    input: {
      width: "100%",
      padding: "10px 0",
      fontSize: "16px",
      borderRadius: "0",
      border: "none",
      backgroundColor: "transparent",
      color: "#333",
    },
    button: {
      backgroundColor: "#007F4E",
      color: "white",
      padding: "15px",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      width: "100%",
      maxWidth: "200px",
      marginTop: "10px",
      transition: "background-color 0.3s ease, transform 0.3s ease",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "580",
      marginTop: "0px",
      marginBottom: "29px",
      textAlign: "center",
      color: "#333",
    },
    successBox: {
      backgroundColor: "#e7f9e7",
      padding: "20px",
      border: "1px solid #7ac88e",
      borderRadius: "8px",
      color: "#4caf50",
      marginBottom: "20px",
    },
    successButton: {
      backgroundColor: "#007F4E",
      color: "white",
      padding: "15px",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      width: "100%",
      maxWidth: "200px",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.mainbox}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Sign Up</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {isSignedUp ? (
          <div style={styles.successBox}>
            <p>
              A confirmation email has been sent to you. Please verify your email
              address to complete the signup process.
            </p>
            <button
              style={styles.successButton}
              onClick={() => navigate("/")}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.halfWidthInputGroupContainer}>
              <div style={styles.halfWidthInputGroup}>
                <label htmlFor="username" style={styles.label}>
                  USERNAME
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.halfWidthInputGroup}>
                <label htmlFor="full_name" style={styles.label}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.fullWidthInputGroup}>
              <label htmlFor="email" style={styles.label}>
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.halfWidthInputGroupContainer}>
              <div style={styles.halfWidthInputGroup}>
                <label htmlFor="password" style={styles.label}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.halfWidthInputGroup}>
                <label htmlFor="confirm_password" style={styles.label}>
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  required
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.fullWidthInputGroup}>
              <label htmlFor="address" style={styles.label}>
                ADDRESS
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.fullWidthInputGroup}>
              <label htmlFor="phone_number" style={styles.label}>
                PHONE NUMBER
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>
              SIGN UP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
