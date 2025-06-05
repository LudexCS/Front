import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/ManageUsersPage.css";
import Sidebar from "../components/layout/Sidebar";
import UserItem from "../components/admin/UserItem";
import NavbarManage from "../components/layout/NavbarManage";
import { useUser } from "../context/UserContext";
import { getUsersList } from "../api/adminApi";

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const { isLoggedIn } = useUser();

  const filteredUsers = users.filter(
    user =>
      user.nickname.includes(searchTerm) ||
      user.email.includes(searchTerm)
  );

  const fetchUsers = async () => {
      try {
        const response = await getUsersList();
        setUsers(response);
      } catch (error) {
        console.error("유저 목록 불러오기 실패:", error);
      }
    };

  useEffect( () => {
    fetchUsers();
  }, []);

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
            <input
                type="text"
                placeholder="Search by nickname or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <div className="user-list">
            {filteredUsers.map(user => (
                <UserItem key={user.id} user={user} />
            ))}
            </div>
        </div>
        </div>
    </div>
  );
};

export default ManageUsersPage;