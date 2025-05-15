import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { logout } from "../../api/userApi";
import "../../styles/layout/Navbar.css";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={()=>navigate("/")}>LUDEX</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/submit-game">Submit Game</Link>
        {isLoggedIn ? 
          <>
            <Link to="/my">My</Link>
            {/* <Link to="/" onClick={()=>logout(setIsLoggedIn)}>Logout</Link> */}
          </> : <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;