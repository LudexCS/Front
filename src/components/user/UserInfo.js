import React from "react";
import "../../styles/UserInfo.css";

const UserInfo = ({ userInfo, onEdit }) => {
  return (
    <div className="user-info-section">
      <div className="left-info">
        <p>nickname: {userInfo.nickname}</p>
        <p>email: {userInfo.email}</p>
        {/* <p>password: {userInfo.password}</p> */}
        <button className="edit-btn" onClick={onEdit}>edit</button>
      </div>
      <div className="right-info">
        <p>Cryptocurrency wallet address</p>
        <ul>
          {userInfo.wallets.map((wallet, idx) => (
            <li key={idx}>{wallet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserInfo;