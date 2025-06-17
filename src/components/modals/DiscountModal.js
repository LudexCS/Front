// src/components/modals/DiscountModal.js
import React, { useEffect, useState } from "react";
import "../../styles/modals/DiscountModal.css";
import {setDiscountGame, setReductionGame} from "../../api/recordApi";
import {useConfig} from "../../context/ConfigContext";
import * as ludex from "ludex";
import {requestRelay} from "../../api/walletAuth";

function convertPrice(price) {
  const parts = price.toString().split('.');
  if(parts.length === 1)
  {
    return BigInt(price) * (10n ** 18n);
  }
  else if (parts.length === 2)
  {
    const intPart = BigInt(parts[0]) * (10n ** 18n);
    const decimalPartLength = parts[1].length;
    const decimalPart =
        BigInt(parts[1]) * (10n ** (18n - BigInt(decimalPartLength)));
    return intPart + decimalPart;
  }
  else
  {
    throw new Error(`Invalid number format given: ${price}`);
  }
}

const DiscountModal = ({ isOpen, onClose, game, resource }) => {
  const originalPrice = game?.price;         // 기본 가격
  const originalPercent = resource?.sellerRatio ? resource?.sellerRatio : 0;        // 기본 지분율
  const { chainConfig, ludexConfig } = useConfig();
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-07-01");
  const [discountPercent, setDiscountPercent] = useState(50);
  const [finalPrice, setFinalPrice] = useState(game?.price/2);
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
  }, [game, discountPercent, isRoyaltyMode]);

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

  const handleSubmit = async () => {
    try{
      if (isRoyaltyMode) {
        if (originalPercent === 0) {
          alert("이 게임은 리소스 감면 할인을 설정할 수 없습니다.");
          return;
        }

        // Web3 reduction 설정 로직.
        try {
          const connection =
              await ludex.BrowserWalletConnection.create(chainConfig);

          const signer = await connection.getSigner();

          const priceTable =
              ludex.facade.createWeb3UserFacade(
                  chainConfig,
                  ludexConfig,
                  signer)
                  .metaTXAccessPriceTable();

          const itemId = resource.sharerId;

          const reducedShare = finalPrice * 100;
          console.log("reducedShare: " + reducedShare);

          const fullISOTime = `${endDate}T00:00:00`; // KST 기준
          const localDate = new Date(fullISOTime);

          const relayRequest =
              await priceTable.startRevShareReductionEventRequest(
                  itemId,
                  reducedShare,
                  localDate,
                  3000000n);

          const { args, error } = await requestRelay(relayRequest);

          if (error) {
            console.error("relay error:", error.message);
            alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
            throw error;
          }
        } catch (error) {
          console.error("change price error: ", error.message);
          alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
          throw error;
        }

        const reduction = {
          resourceId: resource.resourceId,
          discountRate: Number(originalPercent - finalPrice) / 100,
          startsAt: startDate,
          endsAt: endDate
        }
        await setReductionGame(reduction);

        console.log("지분감면 할인이 설정되었습니다.");
      } else {
        // Web3 discount 설정 로직.
        try {
          const connection =
              await ludex.BrowserWalletConnection.create(chainConfig);

          const signer = await connection.getSigner();

          const priceTable =
              ludex.facade.createWeb3UserFacade(
                  chainConfig,
                  ludexConfig,
                  signer)
                  .metaTXAccessPriceTable();

          const itemId = game.itemId;

          const discountPrice = convertPrice(finalPrice);

          const fullISOTime = `${endDate}T00:00:00`; // KST 기준
          const localDate = new Date(fullISOTime);

          const relayRequest =
              await priceTable.startDiscountRequest(
                  itemId,
                  discountPrice,
                  localDate,
                  3000000n);

          const { args, error } = await requestRelay(relayRequest);

          if (error) {
            console.error("relay error:", error.message);
            alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
            throw error;
          }
        } catch (error) {
          console.error("change price error: ", error.message);
          alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
          throw error;
        }

        const discount = {
          gameId: game.gameId,
          discountPrice: finalPrice,
          startsAt: startDate,
          endsAt: endDate
        }
        await setDiscountGame(discount);

        alert("할인 설정되었습니다.");
      }
    } catch (error) {
      alert("할인 설정에 실패했습니다. 다시 시도해주세요.");
    }
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