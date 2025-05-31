import React, { useState } from "react";
import "../../styles/admin/UserItem.css"

const ReportItem = ({ report }) => {
  const [handled, setHandled] = useState(report.isHandled);
  const [expanded, setExpanded] = useState(false);

  const handleBlockToggle = () => {
    // 실제 API 연결 필요
    setHandled(!handled);
  };

  return (
    <div className="user-item">
      <div className="user-item-row">
        <div className="user-info">
          게임: {report.title} / 판매자: {report.nickname} / 신고자: {report.reporter}
        </div>
        <div className="actions">
          <button onClick={handleBlockToggle}>
            {handled ? "Resolved" : "Pending"}
          </button>
          <button onClick={() => setExpanded(!expanded)}>V</button>
        </div>
      </div>

      {expanded && (
        <div className="expanded-section">
          <pre>{report.detail}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportItem;