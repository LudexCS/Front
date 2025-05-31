import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postReport } from "../../api/adminApi";
import { useUser } from "../../context/UserContext";
import "../../styles/modals/ReportModal.css";

const ReportModal = ({ gameId, onClose }) => {
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  const handleReport = async () => {
    if (!isLoggedIn) {
      alert("회원 정보가 필요합니다.");
      navigate("/login");
      return;
    }

    if (!reason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    try {
      await postReport({ reportedGameId: gameId, reportsDetails: reason });
      alert("신고가 접수되었습니다.");
      onClose();
    } catch (err) {
      alert("신고 접수에 실패했습니다.");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>신고하기</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="신고 사유를 입력하세요"
        />
        <div className="modal-buttons">
          <button className="confirm" onClick={handleReport}>
            Report
          </button>
          <button onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;