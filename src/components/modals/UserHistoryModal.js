import React from "react";
import "../../styles/admin/UserItem.css";

const UserHistoryModal = ({ type, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{type === "purchase" ? "Purchase History" : "Sales History"}</h3>
        <button className="close" onClick={onClose}>❌</button>
        <div className="modal-body">
          히스토리 데이터가 여기에 표시됩니다.
        </div>
      </div>
    </div>
  );
};

export default UserHistoryModal;