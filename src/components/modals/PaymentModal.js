import React from "react";
import "../../styles/modals/PaymentModal.css";

const PaymentModal = ({ game, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>결제 확인</h3>
      <p>{game.name}을(를) {game.price.toLocaleString()}₩에 구매하시겠습니까?</p>
      <button onClick={() => { alert("결제 처리됨"); onClose(); }}>결제</button>
      <button onClick={onClose}>취소</button>
    </div>
  </div>
);

export default PaymentModal;