import React, { useState } from "react";
import "../styles/SalesHistory.css";

const SalesHistory = ({ sales, onEditGame, onSetDiscount }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="sales-history">
      {sales.map((item) => (
        <div key={item.id} className="sales-item">
          <div className="sales-summary">
            <span>{item.name} | {item.price.toLocaleString()} 원</span>
            <div>
                <button className="expand-btn" onClick={() => onEditGame(item)}>Edit</button>
                <button className="expand-btn" onClick={() => onSetDiscount(item)}>Set Discount</button>
                <button className="expand-btn" onClick={() => toggleExpand(item.id)}>V</button>
            </div>
          </div>
          {expandedId === item.id && (
            <div className="sales-detail">
              <div className="history-content-row">
                <div className="text-section">
                  <p>설명: {item.description}</p>
                  <p>구동사양: {item.requirements}</p>
                </div>
                <div className="thumbnail-section">
                  <img src={item.thumbnail} alt="thumbnail-img" className="thumbnail-img" />
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