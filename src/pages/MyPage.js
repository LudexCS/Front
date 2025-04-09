import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserInfo from "../components/UserInfo";
import HistoryTabs from "../components/HistoryTabs";
import PurchaseHistory from "../components/PurchaseHistory";
import SalesHistory from "../components/SalesHistory";
import Navbar from "../components/Navbar";
import "./MyPage.css";

const MyPage = () => {
  const { isLoggedIn, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("purchase");
  const navigate = useNavigate();

  const userInfo = {
    nickname: "LudexUser",
    email: "ludex@example.com",
    id: "ludex123",
    password: "password123",
    wallets: ["0xABC123", "0xDEF456"],
  };


  const purchaseHistory = [{
    id: 1,
    type: "game", // "game" | "resource"
    name: "Game A",
    seller: "Seller1",
    price: 10000,
    thumbnail: "https://via.placeholder.com/100", // 임시 썸네일
    description: "This is a fun game A!",
    requirements: "Windows 10, 8GB RAM",
    tags: ["#origin", "#tag1", "#tag2"],
  }, {
    id: 2,
    type: "resource",
    name: "Resource Pack 1",
    seller: "Seller2",
    price: 2000,
    thumbnail: "https://via.placeholder.com/100",
    description: "Character sprites for Game B",
    requirements: "No additional requirements",
    usageTerms: "You must not redistribute these assets separately.",
    gameRelated: "Game B",
  }, ];
  
  const salesHistory = [
    {
      id: 1,
      name: "My Awesome Game",
      seller: "LudexUser",
      price: 5000,
      thumbnail: "https://via.placeholder.com/100",
      description: "My first published game",
      requirements: "Windows 10, 4GB RAM",
      resources: ["Resource1.png", "Resource2.wav"],
    },
    {
      id: 2,
      name: "My Second Game",
      seller: "LudexUser",
      price: 8000,
      thumbnail: "https://via.placeholder.com/100",
      description: "An even cooler game!",
      requirements: "Windows 10, 8GB RAM",
      resources: ["ResourcePack.zip"],
    },
  ];

  return (
    <div className="mypage-container">
      <Navbar />
      <div className="mypage-content">
        <p className="logout-btn" onClick={logout}>로그아웃</p>
        <UserInfo userInfo={userInfo} onEdit={() => navigate("/edit")} />
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