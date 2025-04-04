import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="navbar">
      <div className="logo">LUDEX</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/submit">Submit Game</Link>
        {isLoggedIn ? <Link to="/my">My</Link> : <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;