import React, { useState } from "react";
import "../styles/ReportModal.css";

const ReportModal = ({ gameId, onClose }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>신고하기</h3>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="신고 사유를 입력하세요" />
        <button onClick={() => { 
          // TODO: 신고 API 요청
          alert("신고가 접수되었습니다.");
          onClose(); 
        }}>신고</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

export default ReportModal;