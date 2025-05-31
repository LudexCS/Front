import React, { useState, useEffect } from "react";
import NavbarSearch from "../components/layout/NavbarSearch";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/Instance/axiosInstance";
import { requestWalletNonce, verifyWalletOwnership } from "../api/walletAuth";
import { logout, editUserData } from "../api/userApi";
import { checkNickname } from "../api/signupApi";
import "../styles/pages/EditProfilePage.css";

const EditProfilePage = () => {
  const { user, setIsLoggedIn, setIsFetch } = useUser();
  const [nickname, setNickname] = useState(user ? user.nickname : "");
  const [email] = useState(user ? user.email : "");
  const [wallets, setWallets] = useState(user ? user.cryptoWallet : []);
  const [newWallet, setNewWallet] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  useEffect(() => {
    setIsFetch(false);
  }, []);

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

  const handleAddWallet = async () => {
    if (!newWallet.trim()) return;

    // 지갑 연결된 메타마스크 계정 가져오기
    console.log("지갑 연결된 메타마스크 계정 가져오기");
    if (!window.ethereum) alert("MetaMask가 설치되어 있지 않습니다. 설치 후 새로고침해주세요");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];

    // nonce 요청
    console.log("nonce 요청");
    const nonce = await requestWalletNonce({
      address: walletAddress,
      url: window.location.origin + window.location.pathname,
    });      

    // 서명 요청
    console.log("nonce:", nonce);
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [nonce, walletAddress],
    });

    console.log(signature);

    // 검증 요청
    console.log("검증 요청");
    const result = await verifyWalletOwnership({
      address: walletAddress,
      signature,
    });

    alert(result);
    console.log(result);
    setIsFetch(true);
    setWallets([...wallets, { address: walletAddress, createdAt: new Date().toISOString() }]);
    setNewWallet("");
  };

  const handleDeleteWallet = (index) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if(!isNicknameChecked){
      alert("닉네임 중복체크를 확인주세요.");
    } else {
      try {
        await editUserData(nickname);
        setIsFetch(true);
        alert("저장되었습니다.");
      } catch (err) {
        console.error(err);
        alert("닉네임 변경에 실패했습니다.");
      } finally {
        navigate("/my");
      }
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axiosInstance.delete("/protected/account/delete");
      await logout(setIsLoggedIn);
      navigate("/", { state: { message: res.data.message } });
    } catch (err) {
      alert("계정 삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <div className="edit-profile-page">
      <NavbarSearch />
      <div className="edit-profile">
        <div className="left-panel">
          <label>nickname</label>
          <div className="nickname-row">
            <input
            type="text"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setIsNicknameChecked(false);
            }}
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
            {wallets.map((wallet, i) => (
              <li key={i}>
                {wallet.address}
                {/* (created at {wallet.createdAt}) */}
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