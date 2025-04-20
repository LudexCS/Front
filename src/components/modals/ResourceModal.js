import React, { useState } from "react";
import "../../styles/modals/ResourceModal.css";

const ResourceModal = ({ game, onClose }) => {
  const [activeTab, setActiveTab] = useState("모드");

  const currentResources = game.resources[activeTab];
  const currentContract = game.contracts[activeTab];

  const handlePreview = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{game.name}</h2>

        <div className="tab-header">
          {["모드", "확장판", "후속작"].map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="resource-section">
          <h3>리소스 목록</h3>
          <ul className="resource-list">
            {currentResources.map((res, i) => (
              <li key={i} className="resource-row">
                <span className="resource-name">{res.name}</span>
                <span className="resource-desc">{res.desc}</span>
                <button onClick={() => handlePreview(res.previewUrl)}>미리보기</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="contract-section">
          <h3>계약 내용</h3>
          <pre>{currentContract}</pre>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Back</button>
          <button className="checkout">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;