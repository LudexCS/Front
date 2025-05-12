import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/PurchaseHistory.css";

const PurchaseHistory = ({ purchases, showNft, onDownload }) => {
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="purchase-history">
      {/* 게임 구매내역 */}
      {purchases.games.map((game) => (
        <div key={`game-${game.gameId}`} className="purchase-item">
          <div className="purchase-summary">
            <span>
              게임 | {game.title} | {Number(game.price).toLocaleString()} $
            </span>
            <div>
              <button className="download-btn" onClick={() => showNft(game.itemId)}>Nft</button>
              <button className="download-btn" onClick={() => onDownload(game.id, "game")}>Download</button>
              <button className="expand-btn" onClick={() => toggleExpand(`game-${game.gameId}`)}>V</button>
            </div>
          </div>
          {expandedId === `game-${game.gameId}` && (
            <div className="purchase-detail">
              <div className="history-content-row">
                <div className="text-section">
                  {/* <p>판매자 ID: {game.user_id}</p> */}
                  <p>설명: {game.description}</p>
                  <div>
                    <p>구동사양:</p>
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
                  <button onClick={() => navigate(`/game/${game.gameId}`)}>판매 페이지로 이동</button>
                </div>
                <div className="thumbnail-section">
                  <img src={game.thumbnailUrl} alt="thumbnail-img" className="thumbnail-img" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 리소스 구매내역 */}
      {purchases.resources.map((resource) => (
        <div key={`resource-${resource.resourceId}`} className="purchase-item">
          <div className="purchase-summary">
            <span>
              리소스 | 리소스 ID {resource.resourceId}
            </span>
            <div>
              <button className="download-btn" onClick={() => onDownload(resource.id, "resource")}>Download</button>
              <button className="expand-btn" onClick={() => toggleExpand(`resource-${resource.resourceId}`)}>V</button>
            </div>
          </div>
          {expandedId === `resource-${resource.resourceId}` && (
            <div className="purchase-detail">
              <div className="history-content-row">
                <div className="text-section">
                  {/* <p>판매자 ID: {resource.userId}</p> */}
                  <p>설명: {resource.description}</p>
                  <p>플랫폼 : 10%, 판매자 : {resource.sellerRatio}%, 제작자 : {resource.createrRatio}%</p>
                  <p>관련 게임 ID: {resource.gameId}</p>
                  {/* <p>추가 조건: {resource.}</p> */}
                  <button onClick={() => navigate(`/game/${resource.gameId}`)}>해당 게임 판매페이지 이동</button>
                </div>
                <div className="thumbnail-section">
                  <img src={resource.imageUrl} alt="thumbnail-img" className="thumbnail-img" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PurchaseHistory;