// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import SignUp from "./Components/SignUp";
// import Login from "./Components/SignUp_Login";
// import Home from "./Components/Home";
// import ProductList from "./Components/ProductList";
// import ProfileDetails from "./Components/ProfileDetails";
// import Footer from "./Components/Footer";
// import Navbar from "./Components/Navbar";
// import Bestproduct from "./Components/Bestproduct";

// function PrivateRoute({ element }) {
//   const token = localStorage.getItem("token");
//   return token ? element : <Navigate to="/login" />;
// }

// function AuthRedirect({ element }) {
//   const token = localStorage.getItem("token");
//   return token ? <Navigate to="/home" /> : element;
// }

// function App() {
//   return (
//     <Router>
//       <AppContent /> {/* Wrap everything inside another component */}
//     </Router>
//   );
// }

// function AppContent() {
//   const location = useLocation(); // Now useLocation is inside <Router>

//   return (
//     <>
//       {location.pathname !== "/" && location.pathname !== "/signup" && <Navbar />}
//       <Routes>
//       <Route path="/" element={<AuthRedirect element={<Login />} />} />
//   <Route path="/signup" element={<AuthRedirect element={<SignUp />} />} />
//   <Route path="/login" element={<AuthRedirect element={<Login />} />} />
//   <Route path="/home" element={<PrivateRoute element={<Home />} />} />
//   <Route path="/products/:category" element={<PrivateRoute element={<ProductList />} />} />
//   <Route path="/profile" element={<PrivateRoute element={<ProfileDetails />} />} />
//   <Route path="/bestproduct" element={<PrivateRoute element={<Bestproduct />} />} />
//       </Routes>
//       {location.pathname !== "/" && location.pathname !== "/signup" && <Footer />}
//     </>
//   );
// }


// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

function PrivateRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/" replace />;
}

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
  const location = useLocation(); // Get the current path

  return (
    <>
      {/* Show Navbar only if not on login/signup pages */}
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

      </Routes>

      {/* Show Footer only if not on login/signup pages */}
      {location.pathname !== "/" && location.pathname !== "/signup" && <Footer />}
    </>
  );
}

export default App;
