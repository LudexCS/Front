import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { logout } from "../api/userApi";
import NavbarSearch from "../components/layout/NavbarSearch";
import UserInfo from "../components/user/UserInfo";
import HistoryTabs from "../components/user/HistoryTabs";
import PurchaseHistory from "../components/user/PurchaseHistory";
import SalesHistory from "../components/user/SalesHistory";
import NftModal from "../components/modals/NftModal";
import PayoutModal from "../components/modals/PayoutModal";
import DiscountModal from "../components/modals/DiscountModal";
import { useRecord } from "../context/RecordContext";
import { downloadGame, downloadResource } from "../api/downloadApi";
import "../styles/pages/MyPage.css";

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("purchase");
  const [nftModalOpen, setNftModalOpen] = useState(false);
  const [nftInfo, setNftInfo] = useState(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const { user, isLoggedIn, setIsLoggedIn } = useUser();
  const { recordData } = useRecord();

  const handleLogout = async () => {
    await logout(setIsLoggedIn);
    navigate("/");
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleDownload = async (id, type) => {
    try {
      let result;
      if (type === "game") {
        result = await downloadGame({ gameId: String(id) });
      } else if (type === "resource") {
        result = await downloadResource({ resourceId: String(id) });
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

  const handleNft = (purchaseId) => {
    setNftInfo(purchaseId);
    setNftModalOpen(true);
  };

  const handlePayout = () => {
    setPayoutModalOpen(true);
  };

  const handleDiscount = (game) => {
    setSelectedGame(game);
    setDiscountModalOpen(true);
  };

  const handleEdit = (game) => {
    navigate(`/edit-game/${game.gameId}`)
  }

  return (
    <div className="mypage-container">
      <NavbarSearch />
      <div className="mypage-content">
        <p className="logout-btn" onClick={handleLogout}>logout</p>
        <UserInfo userInfo={user} onEdit={() => navigate("/edit-profile")} requestPayout={handlePayout} />
        <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "purchase" ? (
          <PurchaseHistory purchases={recordData.purchased} onDownload={handleDownload} showNft={handleNft} />
        ) : (
          <SalesHistory sales={recordData.sold} onSetDiscount={handleDiscount}  onEditGame={handleEdit}/>
        )}
      </div>
      <NftModal isOpen={nftModalOpen} onClose={() => setNftModalOpen(false)} purchaseInfo={nftInfo} />
      <PayoutModal isOpen={payoutModalOpen} onClose={() => setPayoutModalOpen(false)} sales={recordData.sold}/>
      <DiscountModal isOpen={discountModalOpen} onClose={() => setDiscountModalOpen(false)} game={selectedGame} />
    </div>
  );
};

export default MyPage;