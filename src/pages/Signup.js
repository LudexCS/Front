import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Navbar from "../components/Navbar";

const Signup = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const checkNickname = () => {
    alert("닉네임 사용 가능!");
  };

  const handleSignup = () => {
    if (password !== repeatPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert("회원가입 성공!");
    navigate("/login");
  };

  return (
    <div>
    <Navbar/>
    <div className="signup-container">
      <div className="signup-content">
        <h2>회원가입</h2>
        <div className="nickname-section">
          <input type="text" placeholder="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <button onClick={checkNickname}>Check Availability</button>
        </div>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="id" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="repeat password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
        <div>
          <button onClick={()=>navigate("/login")}>Back</button>
          <button onClick={handleSignup}>Signup</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;