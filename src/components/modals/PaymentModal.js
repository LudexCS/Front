import React, { useState } from "react";
import "../../styles/modals/PaymentModal.css";
import { useUser } from "../../context/UserContext";

const PaymentModal = ({ game, onClose }) => {
  const [activeTab, setActiveTab] = useState("wallet"); // 'card' or 'wallet'
  const { user } = useUser();
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleConfirm = () => {
    if (activeTab === "card") {
      alert("카드/계좌 결제가 처리되었습니다.");
    } else if (activeTab === "wallet") {
      if (!selectedWallet) {
        alert("지갑 주소를 선택해주세요.");
        return;
      }
      console.log("선택된 지갑 주소:", selectedWallet);
      alert("지갑 결제가 처리되었습니다.");
    }
    onClose();
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-content payment-modal">
        <h3>결제 방법 선택</h3>
        <div className="payment-tab-buttons">
          <button
            className={activeTab === "wallet" ? "active" : ""}
            onClick={() => setActiveTab("wallet")}
          >
            지갑 결제
          </button>
          <button
            className={activeTab === "card" ? "active" : ""}
            onClick={() => setActiveTab("card")}
          >
            카드/계좌 결제
          </button>
        </div>

        {activeTab === "card" && (
          <div className="payment-tab-content">
            <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()}$에 구매하시겠습니까?</p>
            <form className="payment-form">
              <label>
                카드 번호
                <input type="text" placeholder="1234 5678 9012 3456" />
              </label>
              <label>
                유효기간
                <input type="text" placeholder="MM/YY" />
              </label>
              <label>
                CVC
                <input type="text" placeholder="123" />
              </label>
              <label>
                결제자 이름
                <input type="text" placeholder="홍길동" />
              </label>
              <label>
                결제자 이메일
                <input type="email" placeholder="email@example.com" />
              </label>
            </form>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="payment-tab-content">
            <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()}₩에 구매하시겠습니까?</p>
            <p>지갑 주소를 선택해주세요:</p>
            <ul className="payment-wallet-list">
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
          </div>
        )}

        <div className="payment-modal-actions">
          <button className="payment-confirm-btn" onClick={handleConfirm}>결제</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;