import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/SignupPage.css";
import NavbarSearch from "../components/layout/NavbarSearch";
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
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const handleNicknameCheck = async () => {
    if (nickname.length < 2 || nickname.length > 20) {
      alert("닉네임은 2자 이상 20자 이하로 입력해주세요.");
      return;
    }
    try {
      const res = await checkNickname(nickname);
      alert(res.message);
      setIsNicknameChecked(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`실패: ${msg}`);
    }
  };

  const checkEmailDuplicate = async () => {
    try {
      const res = await checkEmail(email);
      alert(`${res.message} 잠시 기다려주세요.`);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`실패: ${msg}`);
      return false;
    }
  };

  const handleEmailCheckAndSendCode = async () => {
    try {
      const isEmailValid = await checkEmailDuplicate();
      if (!isEmailValid) return;
      const res = await sendVerificationCode(email);
      alert(res.message);
      setShowVerification(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`실패: ${msg}`);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await verifyEmailCode(email, verificationCode);
      alert(res.message);
      setEmailVerified(true);
      setShowVerification(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`실패: ${msg}`);
    }
  };

  const handleSignup = async () => {
    if (password.length < 8 || password.length > 16 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      alert("비밀번호는 8~16자 사이이며, 영문자와 숫자를 포함해야 합니다.");
      return;
    }
    if (!isNicknameChecked) {
      alert("닉네임 확인이 필요합니다.");
      return;
    }
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
      const msg = err.response?.data?.message || err.message;
      alert(`실패: ${msg}`);
    }
  };

  return (
    <div className="signup-container">
      <NavbarSearch />
      <div className="signup-content">
        <h2>회원가입</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setIsNicknameChecked(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNicknameCheck();
            }}
          />
          <button onClick={handleNicknameCheck}>Check</button>
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailVerified(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEmailCheckAndSendCode();
            }}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerifyCode();
              }}
            />
            <button onClick={handleVerifyCode}>Check</button>
          </div>
        )}

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSignup();
          }}
        />
        <input
          type="password"
          placeholder="repeat password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSignup();
          }}
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