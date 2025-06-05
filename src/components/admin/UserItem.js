import React, { useState } from "react";
import "../../styles/admin/UserItem.css"
import { postUserBlocked, postUserUnblocked, postUserEmail } from "../../api/adminApi";

const defaultMessage = "게임 <strong>\"게임 제목\"</strong>에 대한 신고가 접수되어 검토 중입니다.<br/>신속한 조치가 필요하니 <a href='게임 상세페이지 url'>내 게임 관리 페이지</a>를 확인해주세요.";

const UserItem = ({ user }) => {
  const [blocked, setBlocked] = useState(user.isBlocked);
  // const [showModal, setShowModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const handleBlockToggle = async () => {{
    if(!blocked){
      try {
        await postUserBlocked(user.email);
        setBlocked(!blocked);
      } catch (error) {
        console.error("유저 차단 실패:", error);
    }}
    else if(blocked){
      try {
        await postUserUnblocked(user.email);
        setBlocked(!blocked);
      } catch (error) {
        console.error("유저 차단 해제 실패:", error);
    }}
  }};

  const handleNotify = async () => {
    try {
      alert("이메일 전송을 시작합니다.")
      await postUserEmail(user.email, message);
      alert("이메일을 전송했습니다.");
      setMessage(defaultMessage);
    } catch (error) {
      console.error("이메일 전송 실패:", error);
    }
  };

  return (
    <div className="user-item">
      <div className="user-item-row">
        <div className="user-info">
          {user.nickname} / {user.email}
        </div>
        <div className="actions">
          {/* <button onClick={() => setShowModal("purchase")}>purchase history</button>
          <button onClick={() => setShowModal("sales")}>sales history</button> */}
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

      {/* {showModal && (
        <UserHistoryModal
          type={showModal}
          user={user}
          onClose={() => setShowModal(null)}
        />
      )} */}
    </div>
  );
};

export default UserItem;