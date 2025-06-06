// src/components/modals/DiscountModal.js
import React, { useEffect, useState } from "react";
import "../../styles/modals/DiscountModal.css";

const DiscountModal = ({ isOpen, onClose, game }) => {
  const originalPrice = 100;         // 기본 가격
  const originalPercent = 30;        // 기본 지분율

  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-07-01");
  const [discountPercent, setDiscountPercent] = useState(50);
  const [finalPrice, setFinalPrice] = useState(50);
  const [isRoyaltyMode, setIsRoyaltyMode] = useState(false);

  // % 변경 시 → 금액 반영
  useEffect(() => {
    let calculated;
    if (isRoyaltyMode) {
      calculated = Math.round((originalPercent * (100 - discountPercent)) / 100);
    } else {
      calculated = Math.round((originalPrice * (100 - discountPercent)) / 100);
    }
    setFinalPrice(calculated);
  }, [discountPercent, isRoyaltyMode]);

  // 금액 변경 시 → % 반영
  const handlePriceChange = (value) => {
    setFinalPrice(value);
    let percent;
    if (isRoyaltyMode) {
      percent = Math.round((1 - value / originalPercent) * 100);
    } else {
      percent = Math.round((1 - value / originalPrice) * 100);
    }
    setDiscountPercent(percent);
  };

  const handleSubmit = () => {
    if (isRoyaltyMode) {
      console.log("지분감면율 설정:");
    } else {
      console.log("할인 설정 내용:");
    }
    console.log("게임 ID:", game?.gameId);
    console.log("시작일:", startDate);
    console.log("종료일:", endDate);
    console.log(isRoyaltyMode ? "지분감면율:" : "할인율:", discountPercent + "%");
    onClose();
  };

  const toggleMode = () => {
    setIsRoyaltyMode((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="discount-modal-overlay" onClick={onClose}>
      <div className="discount-modal" onClick={(e) => e.stopPropagation()}>
        <div className="discount-header" onClick={toggleMode}>
          <span>{isRoyaltyMode ? "일반 할인 설정 >" : "리소스 지분 갱신 >"}</span>
        </div>

        <h3>할인기간</h3>
        <div className="discount-dates">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span> - </span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <h3>{isRoyaltyMode ? "지분감면율" : "할인율"} : {discountPercent}%</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(Number(e.target.value))}
        />

        <div className="discount-summary">
          <span>{isRoyaltyMode ? `${originalPercent}%` : `${originalPrice}$`}</span>
          <span className="arrow">→</span>
          <input
            className="discount-price-input"
            type="number"
            value={finalPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
          />
          <span>{isRoyaltyMode ? "%" : "$"}</span>
        </div>

        <div className="discount-buttons">
          <button onClick={onClose}>Back</button>
          <button onClick={handleSubmit}>Set</button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;