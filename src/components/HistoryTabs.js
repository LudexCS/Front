import React from "react";
import "./HistoryTabs.css";

const HistoryTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="history-tabs">
      <button className={activeTab === "purchase" ? "active" : ""}
              onClick={() => setActiveTab("purchase")}>
        purchase history
      </button>
      <button className={activeTab === "sales" ? "active" : ""}
              onClick={() => setActiveTab("sales")}>
        sales history
      </button>
    </div>
  );
};

export default HistoryTabs;
