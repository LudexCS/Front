// src/components/modals/PayoutModal.js
import React, { useState } from "react";
import "../../styles/modals/PayoutModal.css";
import { useUser } from "../../context/UserContext";

const PayoutModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handlePayoutConfirm = () => {
    if (!selectedWallet) {
      alert("정산을 받을 지갑을 선택해주세요.");
      return;
    }

    console.log("정산 요청된 지갑 주소:", selectedWallet);

    // 실제 정산 요청 API 호출 가능
    alert("정산 요청이 처리되었습니다.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="payout-modal-overlay" onClick={onClose}>
      <div className="payout-modal" onClick={(e) => e.stopPropagation()}>
        <h2>정산 요청</h2>
        <p>수익을 받을 지갑을 선택해주세요:</p>
        <ul className="payout-wallet-list">
          {user?.cryptoWallet?.map((wallet, idx) => (
            <li
              key={idx}
              className={wallet.address === selectedWallet ? "selected" : ""}
              onClick={() => setSelectedWallet(wallet.address)}
            >
              {wallet.address}
            </li>
          ))}
        </ul>
        <div className="payout-actions">
          <button className="payout-confirm-btn" onClick={handlePayoutConfirm}>정산 요청</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default PayoutModal;