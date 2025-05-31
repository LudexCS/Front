import React, { useState } from "react";
import { adminHandleReport } from "../../api/adminApi";
import "../../styles/admin/UserItem.css"

const ReportItem = ({ report, fetchReports }) => {
  const [handled, setHandled] = useState(report.isHandled);
  const [expanded, setExpanded] = useState(false);

  const handleBlockToggle = async () => {
    try {
      await adminHandleReport(report.id);
      fetchReports();
    } catch (error) {
      console.error("신고 처리 실패:", error);
    }
  };

  return (
    <div className="user-item">
      <div className="user-item-row">
        <div className="user-info"> 
          {/* 수정 필요 */}
          게임: {report.reportedGameId} / 판매자: {report.id} / 신고자: {report.complainantId}
        </div>
        <div className="actions">
          <button
            onClick={handleBlockToggle}
            disabled={report.isHandled} // handled가 true면 버튼 비활성화
          >
            {handled ? "Resolved" : "Pending"}
          </button>
          <button onClick={() => setExpanded(!expanded)}>V</button>
        </div>
      </div>

      {expanded && (
        <div className="expanded-section">
          <pre>{report.reportsDetails}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportItem;