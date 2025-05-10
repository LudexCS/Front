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
import "../styles/pages/MyPage.css";
import defaultGameImage from "../assets/game-image.png";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("purchase");
  const navigate = useNavigate();
  const { user, setIsLoggedIn } = useUser();
  const { recordData } = useRecord();

  if (!user) {
    navigate("/");
  }

  const dummyRecord = {
    purchased: {
      games: [
        {
          game_id: 1,
          user_id: 100,//판매자
          title: "Game A",
          price: "10000",
          description: "This is a fun game A!",
          thumbnail_url: defaultGameImage,
          requirement: [
            {
              os: "Windows 10",
              cpu: "i5",
              ram: "8GB",
              gpu: "GTX 1060",
              storage: "20GB",
            },
          ],
        },
      ],
      resources: [
        {
          resource_id: 2,
          user_id: 101,//판매자
          description: "Character sprites for Game B",
          seller_ratio: "30",
          creater_ratio: "60",
          sharer_id: 1,
          image_url: defaultGameImage, //미리보기 이미지.. -> 게임 썸네일 이미지로
          game_id: 1, //+게임 타이틀
        },
      ],
    },
    sold: {
      games: [
        {
          game_id: 3,
          title: "My Awesome Game",
          price: "5000",
          description: "My first published game",
          thumbnail_url: defaultGameImage,
          item_id: 3,
          requirement: [
            {
              os: "Windows 10",
              cpu: "i3",
              ram: "4GB",
              gpu: "GTX 750",
              storage: "10GB",
            },
          ],
        },
      ],
    },
  };

  const handleLogout = async () => {
    await logout(setIsLoggedIn);
    navigate("/");
  };

  return (
    <div className="mypage-container">
      <NavbarSearch />
      <div className="mypage-content">
        <p className="logout-btn" onClick={handleLogout}>logout</p>
        <UserInfo userInfo={user} onEdit={() => navigate("/edit-profile")} />
        <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "purchase" ? (
          <PurchaseHistory purchases={dummyRecord.purchased} />
        ) : (
          <SalesHistory sales={dummyRecord.sold} />
        )}
      </div>
    </div>
  );
};

export default MyPage;