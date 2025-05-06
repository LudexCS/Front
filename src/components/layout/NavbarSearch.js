import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import SearchBar from "./SearchBar";
import "../../styles/layout/Navbar.css";

const Navbar = () => {
  const { isLoggedIn } = useUser();

  return (
    <nav className="navbar">
      <div className="logo">LUDEX</div>
      <SearchBar/>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/submit-game">Submit Game</Link>
        {isLoggedIn ? <Link to="/my">My</Link> : <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;