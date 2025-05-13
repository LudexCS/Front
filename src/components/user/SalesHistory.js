import React, { useState } from "react";
import "../../styles/user/SalesHistory.css";

const SalesHistory = ({ sales, onEditGame, onSetDiscount }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="sales-history">
      {sales.games.map((game) => (
        <div key={game.gameId} className="sales-item">
          <div className="sales-summary">
            <span>{game.title} | {Number(game.price).toLocaleString()} $</span>
            <div>
              <button className="expand-btn" onClick={() => onEditGame(game)}>Edit</button>
              <button className="expand-btn" onClick={() => onSetDiscount(game)}>Set Discount</button>
              <button className="expand-btn" onClick={() => toggleExpand(game.gameId)}>V</button>
            </div>
          </div>
          {expandedId === game.gameId && (
            <div className="sales-detail">
              <div className="history-content-row">
                <div className="text-section">
                  {/* <p>설명:</p> */}
                  <p>{game.description}</p>
                  <div>
                    {/* <p>구동사양: </p> */}
                    {game.requirement?.map((req, i) => (
                      <div key={i}>
                        {[
                          req.os && `OS: ${req.os}`,
                          req.cpu && `CPU: ${req.cpu}`,
                          req.ram && `RAM: ${req.ram}`,
                          req.gpu && `GPU: ${req.gpu}`,
                          req.storage && `Storage: ${req.storage}`
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="thumbnail-section">
                  <img src={game.thumbnailUrl} alt="thumbnail-img" className="thumbnail-img" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SalesHistory;