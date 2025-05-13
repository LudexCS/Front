// src/components/modals/PayoutModal.js
import React, { useState } from "react";
import "../../styles/modals/PayoutModal.css";
import { useUser } from "../../context/UserContext";
import {useConfig} from "../../context/ConfigContext";
import * as ludex from "ludex";
import {getTokenAddress, requestRelay} from "../../api/walletAuth";

const PayoutModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { chainConfig, ludexConfig } = useConfig();
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handlePayoutConfirm = async () => {
    if (!selectedWallet) {
      alert("정산을 받을 지갑을 선택해주세요.");
      return;
    }
    console.log("정산 요청된 지갑 주소:", selectedWallet);

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

    const connection = await ludex.BrowserWalletConnection.create(chainConfig);
    const address = (await connection.getCurrentAddress()).stringValue;

    if (address.toLowerCase() !== selectedWallet.toLowerCase()) {
      alert("MetaMask와 지갑 주소가 일치하지 않습니다. 주소를 확인해주세요.");
      return;
    }

    const tokenAddress = await getTokenAddress();
    console.log("tokenAddress: " + tokenAddress);
    if (!tokenAddress) {
      alert("토큰 주소를 가져오지 못했습니다.");
      return;
    }

    const signer = await connection.getSigner();

    let payment;
    try {
      payment =
          ludex
              .facade
              .createWeb3UserFacade(
                  chainConfig,
                  ludexConfig,
                  signer)
              .metaTXAccessPaymentProcessor();
    } catch (error) {
      console.log("Payment Error: " + error);
      alert("Payment Error: " + error);
      return;
    }

    let balance;
    try {
      balance = await payment.getEscrowBalance(ludex.Address.create(tokenAddress));
      const padded = balance.toString().padStart(7, "0");
      const integerPart = padded.slice(0, -6);
      const decimalPart = padded.slice(-6).replace(/0+$/, "");
      balance = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
      console.log("Balance: " + balance.toString() + " USDC");
      if (balance.toString() === "0") {
        alert("정산할 판매액이 없습니다.");
        onClose();
        return;
      }
    } catch (error) {
      console.log("Balance Error: " + error);
      alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
      onClose();
      return;
    }


    let relayRequest;
    try {
      console.log("ludex.Address.token: " + ludex.Address.create(tokenAddress));
      relayRequest =
          await payment.claimRequest(
              ludex.Address.create(tokenAddress.toString()),
              3000000n);
    } catch (error) {
      console.log("Relay Request Error: " + error);
      alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
      onClose();
      return;
    }

    const { args, error } = await requestRelay(relayRequest);

    if (error)
    {
      console.error(`message: ${error.message}`);
      alert("Server 에러입니다. 관리자에게 문의해주세요.");
      onClose();
      return;
    }

    alert(balance + " USDC 금액의 정산 요청이 처리되었습니다.");
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