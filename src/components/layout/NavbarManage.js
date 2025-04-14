import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Navbar.css";

const NavbarManage = () => {
  const { logout } = useAuth();
  // const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">LUDEX</div>
      <div className="nav-links">
        <Link to="/" onClick={()=>logout()}>Logout</Link>
        {/* {isLoggedIn ? <Link to="/" onClick={()=>logout()}>Logout</Link> : <Link to="/login">Login</Link>} */}
      </div>
    </nav>
  );
};

export default NavbarManage;