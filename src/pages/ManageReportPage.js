import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/ManageUsersPage.css";
import Sidebar from "../components/layout/Sidebar";
import ReportItem from "../components/admin/ReportItem";
import NavbarManage from "../components/layout/NavbarManage";
import { useUser } from "../context/UserContext";
import { adminGetReportList } from "../api/adminApi";

const ManageReportPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [isHandled, setIsHandled] = useState(false);
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await adminGetReportList(isHandled);
      setReports(response);
    } catch (error) {
      console.error("신고 목록 불러오기 실패:", error);
    }
  };

  // 로그인 상태 확인
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 신고 목록 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchReports();
    }
  }, [isHandled, isLoggedIn]);

  return (
    <div>
      <NavbarManage />
      <div className="manage-users-container">
        <Sidebar />
        <div className="user-panel">
          <div className="top-bar">
            <div className="tab-buttons">
              <button
                className={!isHandled ? "active" : ""}
                onClick={() => {
                  setReports([]);
                  setIsHandled(false);}}
              >
                Pending
              </button>
              <button
                className={isHandled ? "active" : ""}
                onClick={() => {
                  setReports([]);
                  setIsHandled(true);}}
              >
                Resolved
              </button>
            </div>
          </div>
          <div className="user-list">
            {reports.map((report) => (
              <ReportItem key={report.report_id} report={report} fetchReports={fetchReports}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageReportPage;