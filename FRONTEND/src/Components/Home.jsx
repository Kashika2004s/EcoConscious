import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Slider from "./Slider";
import TopPicks from "../Components/TopPicks";
import Categories from "./Categories";
import MotoSection from "./MotoSection";
import CustomerTestimonials from "./CustomerTestimonials";
import BestProducts from "./Bestproduct";
// import Footer from "./Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Slider />
      <TopPicks />
      <Categories />
      <MotoSection />
      <BestProducts />
      <CustomerTestimonials />
    </div>
  );
};

// Simple button styling
// const buttonStyle = {
//   margin: "5px",
//   padding: "10px 20px",
//   backgroundColor: "#007bff",
//   color: "#fff",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
// };

export default Home;
