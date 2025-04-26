import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useUser } from "../../context/UserContext";

const DeleteAccount = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "삭제") {
      setError("확인을 위해 '삭제'라고 입력해 주세요.");
      return;
    }

    try {
      await axiosInstance.delete("/user/delete"); // 실제 API endpoint 맞게 수정
      logout(); // ✅ 전역 로그아웃 처리
      navigate("/");
    } catch (err) {
      setError("계정 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="delete-account-container">
      <h2>계정 삭제</h2>
      <p>정말 계정을 삭제하시겠습니까?</p>
      <p><strong>삭제</strong>라고 입력하시면 계정이 삭제됩니다.</p>
      <input
        type="text"
        placeholder="삭제"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />
      <button onClick={handleDelete}>계정 삭제</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DeleteAccount;