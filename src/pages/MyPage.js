import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { logout } from "../api/userApi";
import NavbarSearch from "../components/layout/NavbarSearch";
import UserInfo from "../components/user/UserInfo";
import HistoryTabs from "../components/user/HistoryTabs";
import PurchaseHistory from "../components/user/PurchaseHistory";
import SalesHistory from "../components/user/SalesHistory";
import { useRecord } from "../context/RecordContext";
import { downloadGame, downloadResource } from "../api/downloadApi";
import "../styles/pages/MyPage.css";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("purchase");
  const navigate = useNavigate();
  const { user, setIsLoggedIn } = useUser();
  const { recordData } = useRecord();

  const handleLogout = async () => {
    await logout(setIsLoggedIn);
    navigate("/");
  };

  const handleDownload = async (id, type) => {
    try {
      let result;
      if (type === "game") {
        result = await downloadGame({ gameId: id });
      } else if (type === "resource") {
        result = await downloadResource({ resourceId: id });
      } else {
        throw new Error("알 수 없는 다운로드 타입");
      }

      const url = result.url;
      if (!url) {
        throw new Error("다운로드 URL이 없습니다.");
      }

      // 다운로드 트리거
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = ""; // 브라우저가 filename 처리하게
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err) {
      console.error("다운로드 실패:", err);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  if (!recordData) {
    return (
      <div className="mypage-container">
        <NavbarSearch />
        <div className="mypage-content">
          <p className="logout-btn" onClick={handleLogout}>logout</p>
          <UserInfo userInfo={user} onEdit={() => navigate("/edit-profile")} />
          <p>거래 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <NavbarSearch />
      <div className="mypage-content">
        <p className="logout-btn" onClick={handleLogout}>logout</p>
        <UserInfo userInfo={user} onEdit={() => navigate("/edit-profile")} />
        <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "purchase" ? (
          <PurchaseHistory purchases={recordData.purchased} onDownload={handleDownload} />
        ) : (
          <SalesHistory sales={recordData.sold} />
        )}
      </div>
    </div>
  );
};

export default MyPage;