import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import UserInfo from "../components/user/UserInfo";
import HistoryTabs from "../components/user/HistoryTabs";
import PurchaseHistory from "../components/user/PurchaseHistory";
import SalesHistory from "../components/user/SalesHistory";
import "../styles/pages/MyPage.css";
import defaultGameImage from "../assets/game-image.png";

const MyPage = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("purchase");
  const navigate = useNavigate();

  const userInfo = {
    nickname: "LudexUser",
    email: "ludex@example.com",
    password: "password123",
    wallets: ["0xABC123", "0xDEF456"],
  };

  const purchaseHistory = [
    {
      id: 1,
      type: "game",
      name: "Game A",
      seller: "Seller1",
      price: 10000,
      thumbnail: defaultGameImage,
      description: "This is a fun game A!",
      requirements: "Windows 10, 8GB RAM",
      tags: ["#origin", "#tag1", "#tag2"],
    },
    {
      id: 2,
      type: "resource",
      name: "Resource Pack 1",
      seller: "Seller2",
      price: 2000,
      thumbnail: defaultGameImage,
      description: "Character sprites for Game B",
      requirements: "No additional requirements",
      usageTerms: "You must not redistribute these assets separately.",
      gameRelated: "Game B",
    },
  ];

  const salesHistory = [
    {
      id: 1,
      name: "My Awesome Game",
      seller: "LudexUser",
      price: 5000,
      thumbnail: defaultGameImage,
      description: "My first published game",
      requirements: "Windows 10, 4GB RAM",
      resources: ["Resource1.png", "Resource2.wav"],
    },
    {
      id: 2,
      name: "My Second Game",
      seller: "LudexUser",
      price: 8000,
      thumbnail: defaultGameImage,
      description: "An even cooler game!",
      requirements: "Windows 10, 8GB RAM",
      resources: ["ResourcePack.zip"],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="mypage-container">
      <Navbar />
      <div className="mypage-content">
        <p className="logout-btn" onClick={handleLogout}>
          logout
        </p>
        <UserInfo userInfo={userInfo} onEdit={() => navigate("/edit-profile")} />
        <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "purchase" ? (
          <PurchaseHistory purchases={purchaseHistory} />
        ) : (
          <SalesHistory sales={salesHistory} />
        )}
      </div>
    </div>
  );
};

export default MyPage;