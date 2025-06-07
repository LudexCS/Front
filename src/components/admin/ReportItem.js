import React, { useState } from "react";
import { adminHandleReport } from "../../api/adminApi";
import "../../styles/admin/UserItem.css"

const ReportItem = ({ report, fetchReports }) => {
  const [handled, setHandled] = useState(report.report_ishandled);
  const [expanded, setExpanded] = useState(false);

  const handleBlockToggle = async () => {
    // if(handled){
      try {
        await adminHandleReport(report.report_id);
        fetchReports();
      } catch (error) {
        console.error("신고 처리 실패:", error);
      }
    // }
    // if(!handled){
    //   try {
    //     await adminUnhandleReport(report.id);
    //     fetchReports();
    //   } catch (error) {
    //     console.error("신고 미처리 변경 실패:", error);
    //   }
    // }
  };

  return (
    <div className="user-item">
      <div className="user-item-row">
        <div className="user-info"> 
          {/* 수정 필요 */}
          게임: {report.reportedGame_title} / 판매자: {report.creator_nickname} / 신고자: {report.complainant_nickname}
        </div>
        <div className="actions">
          <button
            onClick={handleBlockToggle}
            disabled={report.report_ishandled} // handled가 true면 버튼 비활성화
          >
            {handled ? "resolved" : "set resolved"}
          </button>
          <button onClick={() => setExpanded(!expanded)}>V</button>
        </div>
      </div>

      {expanded && (
        <div className="expanded-section">
          <pre>{report.report_reports_details}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportItem;