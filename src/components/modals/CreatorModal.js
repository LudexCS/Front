import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/modals/PayoutModal.css";

const CreatorModal = ({ isOpen, onClose, games }) => {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const navigate = useNavigate();

  const handleGoDetailPgae = async () => {
    navigate(`/game/${selectedGameId}`);
    onClose();
  };

//   if (!isOpen) return null;

  return (
      <div className="payout-modal-overlay">
        <div className="payout-modal">
          <h2>제작자의 다른 게임들</h2>
          <div className="payout-sales-summary-wrapper">
            {games.map((game, index) => (
              <div key={game.gameId} className="payout-sales-summary">
                <li 
                  className={game.gameId === selectedGameId ? "selected" : ""}
                  onClick={() => {
                    console.log(selectedGameId);
                    setSelectedGameId(game.gameId);
                  }}
                >
                  <img src={game.thumbnailUrl} alt="payout-thumbnail-img" className="payout-thumbnail-img" />
                  <div>
                    <span>title: {game.title}</span>
                    <span>{game.price} USDC</span>
                    <span>downloadTimes: {game.downloadTimes}</span>
                  </div>
                </li>
              </div>
            ))}
          </div>
          <div className="payout-actions">
            <button className="payout-confirm-btn" onClick={handleGoDetailPgae}>선택한 게임의 상세페이지로 이동</button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
  );
};

export default CreatorModal;