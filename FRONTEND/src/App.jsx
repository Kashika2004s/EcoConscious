import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from "./Components/SignUp_Login";
import Home from "./Components/Home";
import ProductList from "./Components/ProductList";
import ProfileDetails from "./Components/ProfileDetails";
import ProductProfile from "./Components/ProductProfile";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Wishlist from "./Components/Wishlist";
import Bestproduct from "./Components/Bestproduct";
import Cart from "./Components/Cart";
import Order from './Components/Order';
import OrderHistory from './Components/OrderHistory';
import Edit from "./Components/Edit";
import SearchResults from "./Components/SearchResults";

import Alternative from "./Components/Alternative";
function PrivateRoute({ element }) {
  const token = localStorage.getItem("token");
  console.log("PrivateRoute Token:", token); // Debugging

  return token ? element : <Navigate to="/login" replace />;
}

// ✅ Redirect to /home if already logged in
function AuthRedirect({ element }) {
  const token = localStorage.getItem("token");
  console.log("AuthRedirect Token:", token); // Debugging

  return token ? <Navigate to="/home" replace /> : element;
}

function App() {
  useEffect(() => {
    // Remove token when user closes the tab or refreshes
    window.onbeforeunload = () => {
      localStorage.removeItem("token");
    };
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Show Navbar only if not on login/signup pages */}
      {!["/", "/signup", "/login"].includes(location.pathname) && <Navbar />}


      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<AuthRedirect element={<SignUp />} />} />
        <Route path="/login" element={<AuthRedirect element={<Login />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/products/:category" element={<PrivateRoute element={<ProductList />} />} />
        <Route path="/products/:category/:id" element={<PrivateRoute element={<ProductProfile />} />} />
        <Route path="/wishlist" element={<PrivateRoute element={<Wishlist />} />} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/order-history"  element={<OrderHistory /> }/>
        <Route path="/profile" element={<PrivateRoute element={<ProfileDetails />} />} />
        <Route path="/bestproduct" element={<PrivateRoute element={<Bestproduct />} />} />
        <Route path="/search/:term" element={<SearchResults />} />
        <Route path="/edit" element={<PrivateRoute element={<Edit />} />} />
        <Route path="/alternatives/:category/:id" element={<Alternative />} />

      </Routes>

      {/* Show Footer only if not on login/signup pages */}
      {!["/", "/signup", "/login"].includes(location.pathname) && <Footer />}

    </>
  );
}

export default App;
