import React, { useState } from "react";
import "../styles/pages/EditProfilePage.css";
import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axiosInstance";
import { requestWalletNonce, verifyWalletOwnership } from "../api/walletAuth";
import { logout } from "../api/userApi";

const EditProfilePage = () => {
  const { user, setUser, setIsLoggedIn } = useUser();
  const [nickname, setNickname] = useState(user ? user.nickname : "");
  const [email] = useState(user ? user.email : "");
  const [wallets, setWallets] = useState(user ? user.cryptoWallet : []);
  const [newWallet, setNewWallet] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleNicknameCheck = () => {
    alert("사용 가능한 닉네임입니다."); // TODO
  };

  const handleAddWallet = async () => {
    if (!newWallet.trim()) return;

    try {
      // 지갑 연결된 메타마스크 계정 가져오기
      if (!window.ethereum) throw new Error("MetaMask가 설치되어 있지 않습니다.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];

      // nonce 요청
      const nonce = await requestWalletNonce({
        address: walletAddress,
        uri: "ludex.io/mypage/wallet",
      });

      // 서명 요청
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [nonce, walletAddress],
      });

      // 검증 요청
      const result = await verifyWalletOwnership({
        address: walletAddress,
        signature,
      });

      if (result.message === "Wallet Successfully Registered") {
        setWallets([...wallets, walletAddress]);
        setNewWallet("");
        alert("지갑이 성공적으로 인증되었습니다.");
      } else {
        alert("지갑 인증 실패");
      }
    } catch (err) {
      console.error("지갑 인증 실패:", err);
      alert("지갑 인증 중 오류 발생");
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
      const res = await axiosInstance.delete("/protected/account/delete");
      setUser(null);
      await logout(setIsLoggedIn);
      navigate("/", { state: { message: res.data.message } });
    } catch (err) {
      alert("계정 삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <div className="edit-profile-page">
      <Navbar />
      <div className="edit-profile">
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
          <div className="read-only">{email}</div>

          <div className="edit-button-row">
            <button className="edit-button" onClick={() => navigate("/my")}>Back</button>
            <button className="edit-button" onClick={handleSave}>Save</button>
          </div>
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
            <div>
              <p>정말 계정을 삭제하시겠습니까?</p>
              <div className="confirm-button-group">
                <button onClick={confirmDelete}>Yes</button>
                <button onClick={() => setShowDeleteConfirm(false)}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;