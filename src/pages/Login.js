import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("로그인 성공!");
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <div>
    <Navbar/>
    <div className="login-container">
      <div className="login-content">
      <h2>로그인</h2>
      <input type="text" placeholder="id" value={id} onChange={(e) => setId(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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

export default Login;