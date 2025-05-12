// src/components/modals/NftModal.js
import React from "react";
import "../../styles/modals/NftModal.css";

const NftModal = ({ isOpen, onClose, purchaseInfo }) => {
  if (!isOpen) return null;

  const { tokenId, itemId, buyer, timestamp } = purchaseInfo || {};

  const hasNft = tokenId && itemId && buyer && timestamp;

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString()
    : "N/A";

  return (
    <div className="nft-modal-overlay" onClick={onClose}>
      <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
        <h2>NFT 발급 정보</h2>
        {hasNft ? (
          <div className="nft-info">
            <p><strong>Token ID:</strong> {tokenId}</p>
            <p><strong>Item ID:</strong> {itemId}</p>
            <p><strong>구매자:</strong> {buyer}</p>
            <p><strong>구매 일시:</strong> {formattedTime}</p>
          </div>
        ) : (
          <div className="nft-pending">
            <p>NFT가 아직 발급되지 않았습니다.</p>
            <p>전자지갑을 확인해주세요.</p>
          </div>
        )}
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default NftModal;