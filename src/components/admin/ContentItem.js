import React, { useState } from "react";
import "../../styles/admin/UserItem.css"
import GameDetailBar from "../game/GameDetailBar";

const ContentItem = ({ content }) => {
  const [blocked, setBlocked] = useState(content.isBlocked);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
//   const [message, setMessage] = useState(""); // 텍스트 내용
//   const [game, setGame] = useState(null);
  const [resource, setResource] = useState(null);

  const handlePauseToggle = () => {
    // 실제 API 연결 필요
    setBlocked(!blocked);
  };

  return (
    <div className="user-item">
      <div className="user-item-row">
        <div className="user-info">
          {content.title} / {content.gameId}
        </div>
        <div className="actions">
          <button onClick={handlePauseToggle}>
            {blocked ? "Pause" : "Resume"}
          </button>
          <button onClick={() => setExpanded(!expanded)}>V</button>
        </div>
      </div>

      {expanded && (
        <GameDetailBar game={content} />
      )}
    </div>
  );
};

export default ContentItem;