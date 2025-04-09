// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext에서 상태 가져오기
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn } = useAuth(); // ✅ 전역 로그인 상태 사용

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