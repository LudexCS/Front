import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "../../styles/layout/Navbar.css";

const NavbarManage = () => {
  const { logout } = useUser();
  // const { isLoggedIn, logout } = useUser();

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