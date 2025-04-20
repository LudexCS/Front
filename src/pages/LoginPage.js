import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      
      // access token 저장
      localStorage.setItem("accessToken", data.accessToken);

      // 전역 로그인 상태 업데이트
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`실패: ${msg}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          <h2>로그인</h2>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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