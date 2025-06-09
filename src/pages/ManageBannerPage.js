import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/ManageUsersPage.css";
import Sidebar from "../components/layout/Sidebar";
import NavbarManage from "../components/layout/NavbarManage";
import { useUser } from "../context/UserContext";
import BannerItem from "../components/admin/BannerItem";
import AddBannerModal from "../components/modals/AddBannerModal";
import { getAdminBanner } from "../api/adminApi";

const ManageBannerPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isFetch, setIsFetch] = useState(false);

  const fetchBanners = async () => {
    try {
      const response = await getAdminBanner();
      setBanners(response);
    } catch (error) {
      console.error("배너 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    setIsFetch(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // 배너 목록 새로고침
  useEffect(() => {
    fetchBanners();
    if(isFetch){
      setIsFetch(false);
    }
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
          onClose={() => {setShowAddModal(false);}}
          setIsFetch={setIsFetch}
        />
      )}
    </div>
  );
};

export default ManageBannerPage;