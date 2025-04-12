import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignupPage.css";
import Navbar from "../components/Navbar";

const SignupPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const checkNickname = () => {
    alert("닉네임 사용 가능!");
  };

  const sendVerificationCode = () => {
    alert("이메일로 인증코드가 전송되었습니다.");
    setShowVerification(true);
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
    <div className="signup-container">
      <Navbar />
      <div className="signup-content">
        <h2>회원가입</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={checkNickname}>Check</button>
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendVerificationCode}>Send</button>
        </div>

        {showVerification && (
          <div className="form-group">
            <input
              type="text"
              placeholder="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={() => alert("인증 확인 완료")}>Check</button>
          </div>
        )}

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="repeat password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        <div className="signup-action-buttons">
          <button onClick={() => navigate("/login")}>Back</button>
          <button onClick={handleSignup}>Signup</button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;