import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/SignupPage.css";
import Navbar from "../components/layout/Navbar";
import {
  checkNickname,
  checkEmail,
  sendVerificationCode,
  verifyEmailCode,
  signupUser,
} from "../api/signupApi";

const SignupPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const handleNicknameCheck = async () => {
    try {
      const res = await checkNickname(nickname);
      alert(res.message);
    } catch (err) {
      alert("중복된 nickname입니다.");
    }
  };
  
  const handleEmailCheckAndSendCode = async () => {
    try {
      await checkEmail(email);  // 이메일 중복 체크
      const res = await sendVerificationCode(email);  // 인증 이메일 발송
      alert(res.message);
      setShowVerification(true);
    } catch (err) {
      alert("중복된 email입니다.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await verifyEmailCode(email, verificationCode);
      alert(res.message);
      setEmailVerified(true);
    } catch (err) {
      alert("잘못된 인증 코드입니다.");
    }
  };

  const handleSignup = async () => {
    if (!emailVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    if (password !== repeatPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await signupUser({ nickname, email, password, repeatPassword });
      alert(res.message);
      navigate("/login");
    } catch (err) {
      alert("회원가입 실패. 다시 시도해주세요.");
    }
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
          <button onClick={handleNicknameCheck}>Check</button>
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleEmailCheckAndSendCode}>Send</button>
        </div>

        {showVerification && (
          <div className="form-group">
            <input
              type="text"
              placeholder="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={handleVerifyCode}>Check</button>
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