
// export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import SignUp from "./Components/SignUp";
import Login from "./Components/SignUp_Login";
import Home from "./Components/Home";
import ProductList from "./Components/ProductList";
import ProfileDetails from "./Components/ProfileDetails";
import ProductProfile from "./Components/ProductProfile";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Bestproduct from "./Components/Bestproduct";
import Edit from "./Components/Edit";
import Wishlist from "./Components/Wishlist";
import Alternative from "./Components/Alternative";

import Cart from "./Components/Cart";

// ✅ Wrapper to extract route params and pass as props
const AlternativeWrapper = () => {
  const { productId } = useParams(); // removed category
  return <Alternative productId={productId} />;
};

// ✅ Redirect logic for private/protected routes
function PrivateRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/" replace />;
}

// ✅ Redirect to /home if already logged in
function AuthRedirect({ element }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : element;
}

function App() {
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
      {/* Show Navbar except on login/signup pages */}
      {location.pathname !== "/" && location.pathname !== "/signup" && <Navbar />}

      <Routes>
        <Route path="/" element={<AuthRedirect element={<Login />} />} />
        <Route path="/signup" element={<AuthRedirect element={<SignUp />} />} />
        <Route path="/login" element={<AuthRedirect element={<Login />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/products/:category" element={<PrivateRoute element={<ProductList />} />} />
        <Route path="/products/:category/:id" element={<PrivateRoute element={<ProductProfile />} />} />
        <Route path="/wishlist" element={<PrivateRoute element={<Wishlist />} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfileDetails />} />} />
        <Route path="/bestproduct" element={<PrivateRoute element={<Bestproduct />} />} />
        <Route path="/edit" element={<PrivateRoute element={<Edit />} />} />
        <Route path="/alternatives/:category/:id" element={<Alternative />} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />

      </Routes>

      {/* Show Footer except on login/signup pages */}
      {location.pathname !== "/" && location.pathname !== "/signup" && <Footer />}
    </>
  );
}

export default App;
