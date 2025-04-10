import React, { useState } from "react";
import "../styles/PurchaseHistory.css";

const PurchaseHistory = ({ purchases, onDownload, onGoToSalesPage, onShowTerms }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="purchase-history">
      {purchases.map((item) => (
        <div key={item.id} className="purchase-item">
          <div className="purchase-summary">
            <span>
              {item.type === "game" ? "게임" : "리소스"} | {item.name} |{" "}
              {item.price.toLocaleString()} 원
            </span>
            <div>
              <button className="download-btn" onClick={() => onDownload(item)}>Download</button>
              <button className="expand-btn" onClick={() => toggleExpand(item.id)}>V</button>
            </div>
          </div>
          {expandedId === item.id && (
            <div className="purchase-detail">
              <img src={item.thumbnail} alt="thumbnail" className="thumbnail" />
              <p>판매자: {item.seller}</p>
              <p>설명: {item.description}</p>
              <p>구동사양: {item.requirements}</p>
              {item.type === "game" ? (
                <button onClick={() => onGoToSalesPage(item)}>판매 페이지로 이동</button>
              ) : (
                <>
                  <p>관련 게임: {item.gameRelated}</p>
                  <button onClick={() => onShowTerms(item)}>이용조건 보기</button>
                  <button onClick={() => onGoToSalesPage(item)}>해당 게임 판매페이지 이동</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PurchaseHistory;