// src/components/modals/NftModal.js
import React, {useEffect, useState} from "react";
import "../../styles/modals/NftModal.css";
import {useConfig} from "../../context/configContext";
import * as ludex from "ludex";

const NftModal = ({ isOpen, onClose, purchaseInfo }) => {
  const { chainConfig, ludexConfig } = useConfig();
  console.log(purchaseInfo);

  const [nftData, setNftData] = useState({
    tokenId: null,
    itemId: null,
    buyer: null,
    timestamp: null
  });

  if (!isOpen) return null;

  useEffect(async () => {
    const chainIdHex = chainConfig.chainId.toLowerCase();

    try {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

      if (currentChainId !== chainIdHex) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }]
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // 체인 추가 시도
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [chainConfig]
              });
            } catch (addError) {
              console.warn("Add chain failed:", addError);
              const nowChainId = await window.ethereum.request({ method: "eth_chainId" });
              if (nowChainId.toLowerCase() !== chainIdHex) {
                alert("이더리움 네트워크 전환에 실패했습니다.");
                setIsUploading(false);
                return;
              }
            }
          } else {
            throw switchError;
          }
        }
      }
    } catch (err) {
      console.error("MetaMask 네트워크 연결 실패:", err);
    }

    const wallet = await ludex.BrowserWalletConnection.create(chainConfig);
    const address = (await wallet.getCurrentAddress()).stringValue;

    const tokenIDNumber = BigInt("0x" + purchaseInfo);

    const ledger =
        ludex.facade.createWeb2UserFacade(chainConfig, ludexConfig)
            .readonlyAccessLedger();

    const isOwner = await
        ledger.proveOwnership(
            ludex.Address.create(address),
            tokenIDNumber);

    if (isOwner)
    {
      const purchaseLog = await ledger.getPurchaseInfo(tokenIDNumber);

      setNftData({
        tokenId: purchaseLog.tokenID.toString(16),
        itemId: purchaseLog.itemID.toString(),
        buyer: purchaseLog.buyer.stringValue,
        timestamp: purchaseLog.timestamp
      });
    }
    else
    {
      setNftData({
        tokenId: null,
        itemId: null,
        buyer: null,
        timestamp: null
      });
    }
  }, [chainConfig, ludexConfig, purchaseInfo]);

  const { tokenId, itemId, buyer, timestamp } = nftData;

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