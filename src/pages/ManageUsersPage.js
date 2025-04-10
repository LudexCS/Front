import React, { useState } from "react";
import "../styles/ManageUsers.css";
import Sidebar from "../components/Sidebar";
import UserItem from "../components/UserItem";
import NavbarManage from "../components/NavbarManage";

const dummyUsers = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  nickname: `user${i}`,
  email: `user${i}@example.com`,
  isBlocked: i % 2 === 0,
}));

const ManageUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = dummyUsers.filter(
    user =>
      user.nickname.includes(searchTerm) ||
      user.email.includes(searchTerm)
  );

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