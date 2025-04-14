import React from "react";
import "../../styles/upload/LicensingHelpModal.css";

const LicensingHelpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>용도별 설명</h3>
        <ul>
          <li><strong>모드:</strong> 기존 리소스를 기반으로 한 변형 콘텐츠</li>
          <li><strong>확장판:</strong> 원작의 세계관 또는 시스템을 연장</li>
          <li><strong>후속작:</strong> 완전히 새로운 창작물로 발전한 콘텐츠</li>
        </ul>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default LicensingHelpModal;