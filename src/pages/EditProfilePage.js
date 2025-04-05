import React, { useState } from "react";
import "./EditProfilePage.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const EditProfilePage = ({isLoggedIn, setIsLoggedIn}) => {
  const [nickname, setNickname] = useState("nickname");
  const [email, setEmail] = useState("email@example.com");
  const [id] = useState("user123");
  const [password] = useState("********");
  const [wallets, setWallets] = useState(["0x1234...abcd"]);
  const [newWallet, setNewWallet] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleNicknameCheck = () => {
    alert("사용 가능한 닉네임입니다."); // 임시 구현
  };

  const handleAddWallet = () => {
    if (newWallet.trim()) {
      setWallets([...wallets, newWallet]);
      setNewWallet("");
    }
  };

  const handleDeleteWallet = (index) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    alert("저장되었습니다.");
    navigate("/My");
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    alert("계정이 삭제되었습니다.");
    setIsLoggedIn(false);
    navigate("/");
    // <Navbar isLoggedIn={null}/>
    // 로그아웃 처리 로직 필요
  };

  return (
    <div>
    <Navbar isLoggedIn={isLoggedIn}/>
    <div className="edit-profile-page">
      <div className="left-panel">
        <label>nickname</label>
        <div className="nickname-row">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={handleNicknameCheck}>Check</button>
        </div>

        <label>email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>id</label>
        <div className="read-only">{id}</div>

        <label>password</label>
        <div className="read-only">{password}</div>

        <button className="save-button" onClick={()=>navigate("/my")}>Back</button>
        <button className="save-button" onClick={handleSave}>Save</button>
        <div className="account-delete" onClick={handleDeleteAccount}>account delete</div>
      </div>

      <div className="right-panel">
        <label>cryptocurrency wallet address</label>
        <ul>
          {wallets.map((address, i) => (
            <li key={i}>
              {address}
              <button className="delete-wallet" onClick={() => handleDeleteWallet(i)}>x</button>
            </li>
          ))}
        </ul>
        <div className="add-wallet-row">
          <input
            type="text"
            placeholder="Enter new wallet address"
            value={newWallet}
            onChange={(e) => setNewWallet(e.target.value)}
          />
          <button onClick={handleAddWallet}>add</button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-popup">
          <p>정말 계정을 삭제하시겠습니까?</p>
          <div>
            <button onClick={confirmDelete}>확인</button>
            <button onClick={() => setShowDeleteConfirm(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default EditProfilePage;