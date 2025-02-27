import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    fullname: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (token) {
      fetchUserDetails();
    } else {
      console.error("Token is missing");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        console.log("User details updated");
        navigate("/profile");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const styles = {
    whole: {
      display: "flex",
      backgroundColor: "#f2f2f2",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
    },
    container: {
      width: "100%",
      maxWidth: "600px",
      marginTop: "40px",
      padding: "40px",
      backgroundColor: "#ffffff",
      boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.1)",
      //borderRadius: "8px",
    },
    headingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
    },
    heading: {
      fontSize: "24px",
      color: "#333",
    },
    inputGroupContainer: {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
      
    },
    inputGroup: {
      flex: "1",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
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
      borderBottom: "1px solid #ddd",
      borderRadius: "0",
      border: "none",
      backgroundColor: "transparent",
      color: "#333",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "20px",
    },
    button: {
      width: "40%",
      padding: "15px",
      backgroundColor: "#007F4E",
      color: "white",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.3s ease",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.whole}>
      <div style={styles.container}>
        <div style={styles.headingContainer}>
          <h2 style={styles.heading}>Edit Profile</h2>
          
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroupContainer}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userDetails.username}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="fullname" style={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={userDetails.fullname}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={userDetails.address}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="phoneNumber" style={styles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.button}>
              SAVE
            </button>
            <button
              type="button"
              style={styles.button}
              onClick={() => navigate("/profile")}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .inputGroupContainer {
            flex-direction: column;
          }

          .container {
            padding: 20px;
          }

          .heading {
            font-size: 20px;
          }

          .label, .input {
            font-size: 16px;
          }

          .buttonGroup {
            flex-direction: column;
            gap: 10px;
          }

          .button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .heading {
            font-size: 18px;
          }

          .label, .input {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Edit;
