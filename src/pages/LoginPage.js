import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      
      // access token 저장
      localStorage.setItem("accessToken", data.accessToken);

      // 전역 로그인 상태 업데이트
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      setError("로그인 실패. 아이디 또는 비밀번호를 확인하세요.");
      // api작동 시 삭제
      setIsLoggedIn(true);
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
          {error && <p className="error">{error}</p>}
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