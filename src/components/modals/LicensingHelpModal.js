import React from "react";
import "../../styles/upload/LicensingHelpModal.css";

const LicensingHelpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>용도별 설명 (용도에 따라 권장 수익 배분 비율이 다릅니다.)</h2>
        <h3>(ludex 10% 별도)</h3>
        <ul>
          <li><strong>모드:</strong> 기존 리소스를 기반으로 한 변형 콘텐츠 - 30:70</li>
          <li><strong>확장판:</strong> 원작의 세계관 또는 시스템을 연장 - 20:80</li>
          <li><strong>후속작:</strong> 완전히 새로운 창작물로 발전한 콘텐츠 - 10:90</li>
        </ul>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default LicensingHelpModal;