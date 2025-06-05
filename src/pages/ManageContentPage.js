import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/ManageUsersPage.css";
import Sidebar from "../components/layout/Sidebar";
import ContentItem from "../components/admin/ContentItem";
import NavbarManage from "../components/layout/NavbarManage";
import { useUser } from "../context/UserContext";
import { adminGamesByKeyword } from "../api/adminApi";
import { useGameContext } from "../context/gameContext";

const ManageContentPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const { searchTerm, setSearchTerm, contents, setContents } = useGameContext();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleKeyDown = (e) => {
    const fetchGames = async () => {
      if (!searchTerm || searchTerm.trim() === "") {
        setContents([]);
        return;
      }
      try {
        console.log("searchTerm: ", searchTerm);
        const response = await adminGamesByKeyword(searchTerm);
        setContents(response);
      } catch (error) {
        console.error("게임 목록 불러오기 실패:", error);
      }
    };
    if (e.key === "Enter") {
      fetchGames();
    }
  };

  return (
    <div>
      <NavbarManage />
      <div className="manage-users-container">
      <Sidebar />
      <div className="user-panel">
        <div className="top-bar">
        <input
          type="text"
          placeholder="Search by title or tag"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        </div>
        <div className="content-list">
          {contents.map(content => (
            <ContentItem key={content.gameId} content={content} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ManageContentPage;