import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const menuItems = [
  { label: "Manage Users", path: "/manage-users" },
  { label: "Manage Content", path: "/manage-content" },
  { label: "Review Reports", path: "/review-reports" },
  { label: "Edit Banners", path: "/edit-banners" }
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map(({ label, path }) => (
          <li key={label} onClick={() => handleNavigation(path)}>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;