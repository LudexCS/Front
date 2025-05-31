import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/ManageUsersPage.css";
import Sidebar from "../components/layout/Sidebar";
import NavbarManage from "../components/layout/NavbarManage";
import { useUser } from "../context/UserContext";
import BannerItem from "../components/admin/BannerItem";
import AddBannerModal from "../components/modals/AddBannerModal";

const dummyBanners = [
  {
    id: 1,
    imageUrl: "https://example.com/banner1.jpg",
    title: "50% 할인 이벤트 배너",
    linkUrl: "http://localhost:3000/game/90",
    visible: true,
    priority: 1,
    startsAt: "2025-05-10T00:00:00.000Z",
    endsAt: "2025-05-30T23:59:59.000Z",
  },
  {
    id: 2,
    imageUrl: "https://example.com/banner2.jpg",
    title: "신작 게임 출시 안내",
    linkUrl: "http://localhost:3000/game/123",
    visible: true,
    priority: 2,
    startsAt: "2025-06-01T00:00:00.000Z",
    endsAt: "2025-06-15T23:59:59.000Z",
  },
  {
    id: 3,
    imageUrl: "https://example.com/banner3.jpg",
    title: "인디게임 추천 TOP 10",
    linkUrl: "http://localhost:3000/discover/indie",
    visible: false,
    priority: 3,
    startsAt: "2025-05-01T00:00:00.000Z",
    endsAt: "2025-06-01T00:00:00.000Z",
  },
];

const ManageBannerPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isFetch, setIsFetch] = useState(false);

  const fetchBanners = async () => {
    try {
      // const response = await getBannersFromAPI();
      // setBanners(response);
      setBanners(dummyBanners);
    } catch (error) {
      console.error("배너 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // 배너 목록 새로고침
  useEffect(() => {
    fetchBanners();
  }, [isFetch]);

  return (
    <div>
      <NavbarManage />
      <div className="manage-users-container">
        <Sidebar />
        <div className="user-panel">
          <div className="top-bar">
            <div className="tab-buttons">
              <button onClick={() => setShowAddModal(true)}>Add Banner</button>
            </div>
          </div>

          <div className="user-list">
            {banners.map((banner) => (
              <BannerItem
                key={banner.id}
                banner={banner}
                setIsFetch={setIsFetch}
              />
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddBannerModal
          onClose={() => {
            setShowAddModal(false);
            setIsFetch((prev) => !prev);
          }}
        />
      )}
    </div>
  );
};

export default ManageBannerPage;