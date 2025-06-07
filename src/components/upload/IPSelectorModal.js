import React, { useState } from "react";
import { useUpload } from "../../context/UploadContext";
import { useRecord } from "../../context/RecordContext";
import "../../styles/upload/IPSelectorModal.css";

const IPSelectorModal = ({ onClose, setSelectedIPs }) => {
  const [checked, setChecked] = useState({});
  const { setSharerIds, gameForm, setGameForm } = useUpload();
  const { recordData } = useRecord(); //.purchased.resources
  const availableIPs = recordData.purchased.resources; //allowDerivation

  const handleCheck = (resourceId) => {
    setChecked((prev) => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }));
  };

  const handleConfirm = () => {
    const selected = availableIPs
      .filter((ip) => checked[ip.resourceId])
      .map((ip) => `${ip.title}${ip.allowDerivation ? " (2차 제작 허용)" : " (2차 제작 금지)"}`);

    setGameForm({ ...gameForm, originGameIds: availableIPs
      .filter((ip) => checked[ip.resourceId])
      .map((ip) => ip.gameId)});
    console.log("gameForm.originGameIds: ", gameForm.originGameIds);
    
    setSharerIds(availableIPs
      .filter((ip) => checked[ip.resourceId])
      .map((ip) => ip.sharerId));
      
    setSelectedIPs(selected);
    onClose();
  };

  return (
    <div className="ip-modal-overlay">
      <div className="ip-modal-content">
        <h3>사용할 게임 IP 선택</h3>
        <ul className="ip-list">
          {availableIPs.map((ip) => (
            <li key={ip.resourceId}>
              <label>
                <input
                  type="checkbox"
                  checked={!!checked[ip.resourceId]}
                  onChange={() => handleCheck(ip.resourceId)}
                />
                {ip.title} {ip.allowsDerivative}
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