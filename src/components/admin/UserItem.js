import React, { useState } from "react";
import "../../styles/admin/UserItem.css"
import UserHistoryModal from "../modals/UserHistoryModal";

const UserItem = ({ user }) => {
  const [blocked, setBlocked] = useState(user.isBlocked);
  const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState(""); // 텍스트 내용

  const handleBlockToggle = () => {
    // 실제 API 연결 필요
    setBlocked(!blocked);
  };

  const handleNotify = () => {
    console.log(`Notify to ${user.nickname}:`, message);
    setMessage("");
  };

  return (
    <div className="user-item">
      <div className="user-item-row">
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
      </div>

      {expanded && (
        <div className="expanded-section">
          <textarea
            className="user-textarea"
            placeholder="Write something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="notify-button" onClick={handleNotify}>Notify</button>
        </div>
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