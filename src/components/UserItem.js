import React, { useState } from "react";
import "../styles/UserItem.css"
import UserHistoryModal from "./UserHistoryModal";

const UserItem = ({ user }) => {
  const [blocked, setBlocked] = useState(user.isBlocked);
  const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleBlockToggle = () => {
    // 실제 API 연결 필요
    setBlocked(!blocked);
  };

  return (
    <div className="user-item">
      <div className="user-info">
        {user.nickname} / {user.email}
      </div>
      <div className="actions">
        <button onClick={() => setShowModal("purchase")}>purchase history</button>
        <button onClick={() => setShowModal("sales")}>sales history</button>
        <button onClick={handleBlockToggle}>
          {blocked ? "Unblock" : "Block"}
        </button>
        <button onClick={() => setExpanded(!expanded)}>V</button>
      </div>
      {expanded && (
        <textarea className="user-textarea" placeholder="Write something..."></textarea>
      )}
      {showModal && (
        <UserHistoryModal
          type={showModal}
          onClose={() => setShowModal(null)}
        />
      )}
    </div>
  );
};

export default UserItem;