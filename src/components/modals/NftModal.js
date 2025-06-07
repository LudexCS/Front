// src/components/modals/NftModal.js
import React, {useEffect, useState} from "react";
import "../../styles/modals/NftModal.css";
import {useConfig} from "../../context/ConfigContext";
import { useUser } from "../../context/UserContext";
import * as ludex from "ludex";
import {claimPurchase} from "../../api/walletAuth";

const NftModal = ({ isOpen, onClose, purchaseInfo }) => {
  const { chainConfig, ludexConfig } = useConfig();
  const [hasNft, setHasNft] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const { user } = useUser();
  const [showWallets, setShowWallets] = useState(false);

  const [nftData, setNftData] = useState({
    tokenId: null,
    itemId: null,
    buyer: null,
    timestamp: null
  });

  useEffect(() => {
    const run = async () => {
      if (!isOpen) return;

      let isOwner = null;

      if(!purchaseInfo) {
        return;
      }

      const tokenIDNumber = BigInt(purchaseInfo);

      let ledger;
      try {
        ledger =
            ludex.facade.createWeb2UserFacade(chainConfig, ludexConfig)
                .readonlyAccessLedger();
      } catch (error) {
        console.log("Error: " + error);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const chainIdHex = chainConfig.chainId.toLowerCase();


      try {
        const currentChainId = await window.ethereum.request({method: "eth_chainId"});

        if (currentChainId !== chainIdHex) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{chainId: chainIdHex}]
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
                const nowChainId = await window.ethereum.request({method: "eth_chainId"});
                if (nowChainId.toLowerCase() !== chainIdHex) {
                  alert("이더리움 네트워크 전환에 실패했습니다.");
                  return;
                }
              }
            } else {
              throw switchError;
            }
          }
        }

        const wallet = await ludex.BrowserWalletConnection.create(chainConfig);

        const address = (await wallet.getCurrentAddress()).stringValue;


        isOwner = await ledger.proveOwnership(
            ludex.Address.create(address),
            tokenIDNumber
        );
      } catch (err) {
        console.error("MetaMask 네트워크 연결 실패:", err);
      }

      let purchaseLog;
      let buyer;
      try {
        purchaseLog = await ledger.getPurchaseInfo(tokenIDNumber);

        buyer = (function () {
          if (typeof(purchaseLog.buyer) === "bigint")
          {
            return (purchaseLog.buyer.toString());
          }
          else
          {
            return (purchaseLog.buyer.stringValue);
          }
        })();

      } catch (error) {
        console.log("Error: " + error);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      if (isOwner && purchaseLog && buyer)
      {
        setNftData({
          tokenId: purchaseLog.tokenID.toString(16),
          itemId: purchaseLog.itemID.toString(),
          buyer: buyer,
          timestamp: purchaseLog.timestamp
        });

        setHasNft(true);
      }
      // Web2 결제 사용자 - nft가 컨트랙트 상에 존재하지만, 사용자 지갑에 귀속되지는 않은 상태.
      else if (purchaseLog && buyer)
      {
        setNftData({
          tokenId: purchaseLog.tokenID.toString(16),
          itemId: purchaseLog.itemID.toString(),
          buyer: buyer,
          timestamp: purchaseLog.timestamp
        });

        setHasNft(false);
      }
      else {
        setNftData({
          tokenId: null,
          itemId: null,
          buyer: null,
          timestamp: null
        });

        setHasNft(false);
      }
    };

    run();
  }, [isOpen, chainConfig, ludexConfig, purchaseInfo]);

  if (!isOpen) return null;

  const { tokenId, itemId, buyer, timestamp } = nftData;

  const hasPurchaseLog = tokenId && itemId && buyer && timestamp;

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString()
    : "N/A";

  const ConnectWallet = async () => {
    if (!selectedWallet) {
      alert("지갑을 선택해주세요.");
      return;
    }

    const requestBody = {
      ownerId: user.ownerId,
      purchaseId: purchaseInfo,
      ownerAddress: selectedWallet
    }

    try {
      const response = await claimPurchase(requestBody);
      /*
      const responseOwnerAddress = response.result.ownerAddress;
      const responsePurchaseId = response.result.purchaseId;
      console.log("responseOwnerAddress: ", responseOwnerAddress, "responsePurchaseId: ", responsePurchaseId);
       */
      alert(`선택된 지갑(${selectedWallet})으로 연결 요청 성공`);
    } catch (error) {
      console.error("NFT 연결 요청 실패:", error.message);
      alert(`선택된 지갑(${selectedWallet})으로 연결 요청 실패`);
    }

  }

  return (
    <div className="nft-modal-overlay" onClick={onClose}>
      <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
        <h2>NFT 발급 정보</h2>
        {hasPurchaseLog ? (
          hasNft ? (
            <div className="nft-info">
              <p><strong>Token ID:</strong> {tokenId}</p>
              <p><strong>Item ID:</strong> {itemId}</p>
              <p><strong>구매자:</strong> {buyer}</p>
              <p><strong>구매 일시:</strong> {formattedTime}</p>
            </div>
          ) : (
            <div className="nft-info">
              <p><strong>Token ID:</strong> {tokenId}</p>
              <p><strong>Item ID:</strong> {itemId}</p>
              <p><strong>구매자:</strong> {buyer}</p>
              <p><strong>구매 일시:</strong> {formattedTime}</p>
              <p className="unassigned-note">※ NFT는 발급되었지만 아직 지갑에 귀속되지 않았습니다.</p>
              {!hasNft && buyer && (
                <div>
                  <button className="assign-wallet-btn" onClick={() => setShowWallets(!showWallets)}>
                    내 지갑에 연결
                  </button>
                  {showWallets && (
                    <div className="wallet-selection">
                      <ul className="wallet-list">
                        {user?.cryptoWallet?.map((wallet, idx) => (
                          <li
                            key={idx}
                            className={`wallet-item ${selectedWallet === wallet.address ? "selected" : ""}`}
                            onClick={() => setSelectedWallet(wallet.address)}
                          >
                            {wallet.address}
                          </li>
                        ))}
                      </ul>
                      <button className="confirm-wallet-btn" onClick={ConnectWallet}>
                        연결하기
                      </button>
                      <button className="confirm-wallet-btn" onClick={() => setShowWallets(!showWallets)}>
                        Back
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="nft-pending">
            <p>발급정보를 가져오고 있거나, NFT가 아직 발급되지 않았습니다.</p>
            <p>잠시 기다린 후 전자지갑을 확인해주세요.</p>
          </div>
        )}
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default NftModal;