import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from "./Components/SignUp_Login";
import Home from "./Components/Home";
import ProductList from "./Components/ProductList";
import ProfileDetails from "./Components/ProfileDetails";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Bestproduct from "./Components/Bestproduct";

function PrivateRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
}

function AuthRedirect({ element }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" /> : element;
}

function App() {
  return (
    <Router>
      <AppContent /> {/* Wrap everything inside another component */}
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); // Now useLocation is inside <Router>

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/signup" && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthRedirect element={<Login />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/signup" element={<AuthRedirect element={<SignUp />} />} />
        <Route path="/login" element={<AuthRedirect element={<Login />} />} />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfileDetails />} />} />
        <Route path="/bestproduct" element={<Bestproduct />} />
      </Routes>
      {location.pathname !== "/" && location.pathname !== "/signup" && <Footer />}
    </>
  );
}


export default App;
