import React, { useState } from "react";
import { useUpload } from "../../context/UploadContext";
import { useRecord } from "../../context/RecordContext";
import "../../styles/upload/IPSelectorModal.css";

const availableIPs = [
  { resource_id: 111, game_title: "구매한 게임 A", allowsDerivative: true, sharer_id: 1 },
  { resource_id: 222, game_title: "구매한 게임 B", allowsDerivative: false, sharer_id: 2 },
  { resource_id: 333, game_title: "구매한 게임 C", allowsDerivative: true, sharer_id: 3 },
  // 실제 API로 불러올 수 있음
];

const IPSelectorModal = ({ onClose, setSelectedIPs }) => {
  const [checked, setChecked] = useState({});
  const { setSharerIds, gameForm, setGameForm } = useUpload();
  // const { recordData } = useRecord(); //.purchased.resources

  const handleCheck = (resource_id) => {
    setChecked((prev) => ({
      ...prev,
      [resource_id]: !prev[resource_id],
    }));
  };

  const handleConfirm = () => {
    const selected = availableIPs
      .filter((ip) => checked[ip.resource_id])
      .map((ip) => `${ip.game_title}${ip.allowsDerivative ? " (2차 제작 허용)" : " (2차 제작 금지)"}`);

    setGameForm({ ...gameForm, originGameIds: availableIPs
      .filter((ip) => checked[ip.resource_id])
      .map((ip) => ip.resource_id)});

    setSharerIds(availableIPs
      .filter((ip) => checked[ip.resource_id])
      .map((ip) => ip.sharer_id));
      
    setSelectedIPs(selected);
    onClose();
  };

  return (
    <div className="ip-modal-overlay">
      <div className="ip-modal-content">
        <h3>사용할 게임 IP 선택</h3>
        <ul className="ip-list">
          {availableIPs.map((ip) => (
            <li key={ip.resource_id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!checked[ip.resource_id]}
                  onChange={() => handleCheck(ip.resource_id)}
                />
                {ip.game_title} {ip.allowsDerivative}
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