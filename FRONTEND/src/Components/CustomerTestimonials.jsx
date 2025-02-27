import React from "react";
import { FaUserCircle } from "react-icons/fa";

const testimonials = [
  {
    name: "Sneha",
    location: "Delhi, India",
    text: "The eco-friendly fashion options are fantastic. I love how stylish and sustainable they are!",
  },
  {
    name: "Kamaljeet Kaur",
    location: "Punjab, India",
    text: "Excellent quality and great for the planet. The zero-waste packaging is a big plus!",
  },
  {
    name: "Kanchan Yadav",
    location: "Uttar Pradesh, India",
    text: "A wonderful store with a commitment to sustainability. Highly recommend their products!",
  },
];

const CustomerTestimonials = () => {
  return (
    <section style={styles.container}>
      <h2 style={styles.title}>What Our Customers Are Saying</h2>
      <div style={styles.testimonialsWrapper}>
        {testimonials.map((testimonial, index) => (
          <div key={index} style={styles.testimonialCard}>
            <div style={styles.profileIcon}>
              <FaUserCircle size={80} color="#4caf50" />
            </div>
            <div style={styles.textContainer}>
              <p style={styles.text}>{`"${testimonial.text}"`}</p>
              <p style={styles.name}>— {testimonial.name}</p>
              <p style={styles.location}>{testimonial.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#f2f2f2", 
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  testimonialsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "100%", // Extend to cover the full width of the page
    margin: "0 auto",
  },
  testimonialCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    textAlign: "left",
    width: "90%", // Adjust width to cover more of the webpage
    margin: "0 auto", // Center the testimonial cards
  },
  profileIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    marginRight: "20px",
    backgroundColor: "#f5f5f5",
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: "1.1rem",
    fontStyle: "italic",
    color: "#555",
    marginBottom: "10px",
  },
  name: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#333",
  },
  location: {
    fontSize: "1rem",
    color: "#777",
  },
};

export default CustomerTestimonials;
