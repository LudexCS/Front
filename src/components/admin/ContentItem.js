import React, { useState } from "react";
import "../../styles/admin/UserItem.css"
import GameDetailBar from "../game/GameDetailBar";
import { postUserBlocked, postGameUnblocked } from "../../api/adminApi";

const ContentItem = ({ content }) => {
  const [blocked, setBlocked] = useState(content.isBlocked);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
//   const [message, setMessage] = useState(""); // 텍스트 내용
//   const [game, setGame] = useState(null);
  const [resource, setResource] = useState(null);

  const handlePauseToggle = async () => {
    if(!blocked){
      try {
        await postUserBlocked(content.title);
        setBlocked(!blocked);
      } catch (error) {
        console.error("게임 차단 실패:", error);
    }}
    else if(blocked){
      try {
        await postGameUnblocked(content.title);
        setBlocked(!blocked);
      } catch (error) {
        console.error("게임 차단 해제 실패:", error);
    }}
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