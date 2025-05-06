import React from "react";
// import "../../styles/upload/TermsAgreementModal.css"; // 약관 스타일

const TermsAgreementModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>이용 약관</h3>
        <div className="terms-content">
          <p>이 플랫폼은 ... (약관 내용 삽입)</p>
          <p>1. 사용자는 본인이 등록한 콘텐츠에 대한 책임을 집니다.</p>
          <p>2. 2차 창작물 등록 시 해당 원작의 허가 여부를 확인해야 합니다.</p>
          ...
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TermsAgreementModal;