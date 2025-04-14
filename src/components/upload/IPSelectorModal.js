import React, { useState } from "react";
import "../../styles/upload/IPSelectorModal.css";

const availableIPs = [
  { id: "ip1", name: "구매한 게임 A", allowsDerivative: true },
  { id: "ip2", name: "구매한 게임 B", allowsDerivative: false },
  { id: "ip3", name: "구매한 게임 C", allowsDerivative: true },
  // 실제 API로 불러올 수 있음
];

const IPSelectorModal = ({ onClose, setSelectedIPs }) => {
  const [checked, setChecked] = useState({});

  const handleCheck = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleConfirm = () => {
    const selected = availableIPs
      .filter((ip) => checked[ip.id])
      .map((ip) => `${ip.name}${ip.allowsDerivative ? " (2차 허용)" : " (2차 금지)"}`);
    setSelectedIPs(selected);
    onClose();
  };

  return (
    <div className="ip-modal-overlay">
      <div className="ip-modal-content">
        <h3>사용할 게임 IP 선택</h3>
        <ul className="ip-list">
          {availableIPs.map((ip) => (
            <li key={ip.id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!checked[ip.id]}
                  onChange={() => handleCheck(ip.id)}
                />
                {ip.name} {ip.allowsDerivative}
              </label>
            </li>
          ))}
        </ul>
        <div className="modal-buttons">
          <button onClick={onClose}>취소</button>
          <button onClick={handleConfirm}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default IPSelectorModal;