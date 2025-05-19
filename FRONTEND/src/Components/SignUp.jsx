import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const first_name = e.target.first_name.value;
    const last_name = e.target.last_name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirm_password.value;
    const phoneNumber = e.target.phoneNumber.value;
    const street = e.target.street.value;
    const city = e.target.city.value;
    const state_zip = e.target.state_zip.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://ecoconsciousback.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          first_name,
          last_name,
          email,
          password,
          confirmPassword,
          phoneNumber,
          street,
          city,
          state_zip,
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
              A confirmation email has been sent. Please verify your email to
              complete signup.
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
  {/* First Name & Last Name side by side */}
  <div style={{ ...styles.halfWidthInputGroupContainer, marginBottom: "7px" }}>
    <div style={styles.halfWidthInputGroup}>
      <label htmlFor="first_name" style={styles.label}>FIRST NAME</label>
      <input type="text" id="first_name" name="first_name" required style={styles.input} />
    </div>
    <div style={styles.halfWidthInputGroup}>
      <label htmlFor="last_name" style={styles.label}>LAST NAME</label>
      <input type="text" id="last_name" name="last_name" required style={styles.input} />
    </div>
  </div>

  {/* Username - Full width */}
  <div style={{ ...styles.fullWidthInputGroup, marginBottom: "7px" }}>
    <label htmlFor="username" style={styles.label}>USERNAME</label>
    <input type="text" id="username" name="username" required style={styles.input} />
  </div>

  {/* Email */}
  <div style={{ ...styles.fullWidthInputGroup, marginBottom: "7px" }}>
    <label htmlFor="email" style={styles.label}>EMAIL</label>
    <input type="email" id="email" name="email" required style={styles.input} />
  </div>

  {/* Passwords side by side */}
  <div style={{ ...styles.halfWidthInputGroupContainer, marginBottom: "7px" }}>
    <div style={styles.halfWidthInputGroup}>
      <label htmlFor="password" style={styles.label}>PASSWORD</label>
      <input type="password" id="password" name="password" required style={styles.input} />
    </div>
    <div style={styles.halfWidthInputGroup}>
      <label htmlFor="confirm_password" style={styles.label}>CONFIRM PASSWORD</label>
      <input type="password" id="confirm_password" name="confirm_password" required style={styles.input} />
    </div>
  </div>

  {/* Phone Number */}
  <div style={{ ...styles.fullWidthInputGroup, marginBottom: "7px" }}>
    <label htmlFor="phoneNumber" style={styles.label}>PHONE NUMBER</label>
    <input type="tel" id="phoneNumber" name="phoneNumber" required style={styles.input} />
  </div>

  {/* Street */}
  <div style={{ ...styles.fullWidthInputGroup, marginBottom: "7px" }}>
    <label htmlFor="street" style={styles.label}>STREET</label>
    <input type="text" id="street" name="street" required style={styles.input} />
  </div>

  {/* City & State-Zip side by side */}
  <div style={{ ...styles.halfWidthInputGroupContainer, marginBottom: "7px" }}>
    <div style={styles.halfWidthInputGroup}>
      <label htmlFor="city" style={styles.label}>CITY</label>
      <input type="text" id="city" name="city" required style={styles.input} />
    </div>
    <div style={styles.halfWidthInputGroup}>
      <label htmlFor="state_zip" style={styles.label}>STATE & ZIP</label>
      <input type="text" id="state_zip" name="state_zip" required style={styles.input} />
    </div>
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
