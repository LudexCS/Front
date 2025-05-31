import React, { useEffect } from "react";
import "../../styles/admin/UserItem.css";

const UserHistoryModal = ({ type, onClose, user }) => {
  useEffect(() => {
  }, []);
  
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{type === "purchase" ? "Purchase History" : "Sales History"}</h3>
        <button className="close" onClick={onClose}>❌</button>
        <div className="modal-body">
          {user.nickname}의 히스토리 데이터가 여기에 표시됩니다.
        </div>
      </div>
    </div>
  );
};

export default UserHistoryModal;