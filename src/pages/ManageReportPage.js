import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/ManageUsersPage.css";
import Sidebar from "../components/layout/Sidebar";
import ReportItem from "../components/admin/ReportItem";
import NavbarManage from "../components/layout/NavbarManage";
import { useUser } from "../context/UserContext";

const dummyReports = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  title: `test${i}`,
  nickname: `user${i}`,
  reporter: `user${i*10}`,
  isHandled: i % 2 === 0,
  detail: "report message",
}));

const ManageReportPage = () => {
  const navigate = useNavigate();
  const [isHandled, setIsHandled] = useState(false);
  const { isLoggedIn } = useUser();

  const filteredUsers = dummyReports.filter(
    user => user.isHandled === isHandled
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
        <NavbarManage />
        <div className="manage-users-container">
        <Sidebar />
        <div className="user-panel">
            <div className="top-bar">
            <div className="top-bar">
            <div className="tab-buttons">
                <button
                className={!isHandled ? "active" : ""}
                onClick={() => setIsHandled(false)}>Pending</button>
                <button
                className={isHandled ? "active" : ""}
                onClick={() => setIsHandled(true)}>Resolved</button>
            </div>
            </div>
            </div>
            <div className="user-list">
            {filteredUsers.map(report => (
                <ReportItem key={report.id} report={report} />
            ))}
            </div>
        </div>
        </div>
    </div>
  );
};

export default ManageReportPage;