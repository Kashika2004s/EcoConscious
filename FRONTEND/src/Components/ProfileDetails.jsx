import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.error("No token provided");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://ecoconsciousback.onrender.com/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        setProfile(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleDelete = async () => {
    try {
      const response = await fetch("https://ecoconsciousback.onrender.com/api/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Profile deleted successfully");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete profile:", errorData.message || errorData);
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data available</div>;

  const styles = {
    whole: {
      display: "flex",
      backgroundColor: "#f2f2f2",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      marginTop:"50px"
    },
    container: {
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px",
      backgroundColor: "#ffffff",
      boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.1)",
    },
    headingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
    },
    heading: {
      fontSize: "24px",
      marginLeft: "10px",
      color: "#333",
    },
    detailGroup: {
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #ddd",
      paddingBottom: "8px",
    },
    label: {
      fontSize: "18px",
      color: "#444",
      flex: "1",
    },
    value: {
      fontSize: "18px",
      color: "#777",
      textAlign: "right",
      flex: "1",
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
          <h2 style={styles.heading}>Profile Details</h2>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>Full Name</span>
          <span style={styles.value}>
            {profile.first_name} {profile.last_name}
          </span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>Username</span>
          <span style={styles.value}>{profile.username}</span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>Email</span>
          <span style={styles.value}>{profile.email}</span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>Phone Number</span>
          <span style={styles.value}>{profile.phoneNumber}</span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>Verified</span>
          <span style={styles.value}>{profile.isVerified ? "Yes" : "No"}</span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>Street</span>
          <span style={styles.value}>{profile.street}</span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>City</span>
          <span style={styles.value}>{profile.city}</span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>State & ZIP</span>
          <span style={styles.value}>{profile.state_zip}</span>
        </div>

        <div style={styles.detailGroup}>
          <span style={styles.label}>Created At</span>
          <span style={styles.value}>
            {new Date(profile.created_at).toLocaleString()}
          </span>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={() => navigate(`/edit`)}>
            EDIT
          </button>
          <button style={styles.button} onClick={handleDelete}>
            DELETE
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            padding: 20px;
          }

          .heading {
            font-size: 20px;
          }

          .label,
          .value {
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

          .label,
          .value {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileDetails;
