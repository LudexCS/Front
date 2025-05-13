import React from "react";
import "../../styles/user/UserInfo.css";

const UserInfo = ({ userInfo, onEdit, requestPayout }) => {
  return (
    <div className="user-info-section">
      <div className="left-info">
        <p>nickname: {userInfo.nickname}</p>
        <p>email: {userInfo.email}</p>
        <button className="edit-btn" onClick={onEdit}>edit</button>
      </div>
      <div className="right-info">
        <p>Cryptocurrency wallet address</p>
        <ul>
          {userInfo.cryptoWallet.map((wallet, idx) => (
            <li key={idx}>
              {wallet.address}
            </li>
          ))}
        </ul>
        <button className="edit-btn" onClick={() => requestPayout()}>Payout</button>
      </div>
    </div>
  );
};

export default UserInfo;