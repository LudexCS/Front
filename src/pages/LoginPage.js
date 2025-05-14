import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSearch from "../components/layout/NavbarSearch";
import { loginUser } from "../api/userApi";
import { useUser } from "../context/UserContext";
import "../styles/pages/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { accessToken } = await loginUser(email, password);
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`실패: ${msg}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div>
      <NavbarSearch />
      <div className="login-container">
        <div className="login-content">
          <h2>로그인</h2>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            If you don’t have an account:{" "}
            <span className="signup-link" onClick={() => navigate("/signup")}>
              sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;