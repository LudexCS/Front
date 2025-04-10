import React, { useState } from "react";
import "../styles/EditProfilePage.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const EditProfilePage = () => {
  const [nickname, setNickname] = useState("nickname");
  const [email, setEmail] = useState("email@example.com");
  const [password] = useState("********");
  const [wallets, setWallets] = useState(["0x1234...abcd"]);
  const [newWallet, setNewWallet] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNicknameCheck = () => {
    alert("사용 가능한 닉네임입니다."); // TODO: 실제 중복 확인 API 연결
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
    navigate("/my");
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete("/user/delete");

      await logout();
      navigate("/");
    } catch (err) {
      alert("계정 삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
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

          <label>password</label>
          <div className="read-only">{password}</div>

          <button className="save-button" onClick={() => navigate("/my")}>Back</button>
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