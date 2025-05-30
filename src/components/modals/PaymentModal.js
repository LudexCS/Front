import React, { useEffect, useState } from "react";
import "../../styles/modals/PaymentModal.css";
import { useUser } from "../../context/UserContext";
import { useConfig } from "../../context/ConfigContext";
import { useRecord } from "../../context/RecordContext";
import * as ludex from "ludex";
import { getTokenAddress, requestRelay } from "../../api/walletAuth";
import { registerPurchase } from "../../api/purchaseApi";
import LoadingModal from "./LoadingModal";

const PaymentModal = ({ game, onClose }) => {
  const [activeTab, setActiveTab] = useState("wallet");
  const { user } = useUser();
  const { chainConfig, ludexConfig } = useConfig();
  const { setIsFetch } = useRecord();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [tokenAmount, setTokenAmount] = useState("");
  const [krwAmount, setKrwAmount] = useState("");
  const [isUploading, setIsUploading] = useState(false); // 추가됨

  useEffect(() => {
    setIsFetch(false);
  }, []);

  useEffect(() => {
    (async () => {
      if (!chainConfig || !ludexConfig || !game?.itemId) return;

      const itemId = game.itemId;
      let priceInfo;
      try {
        const facade = ludex.facade.createWeb2UserFacade(chainConfig, ludexConfig);
        const priceTable = facade.readonlyAccessPriceTable();
        const priceInfoListRaw = await priceTable.getPriceInfoList(BigInt(itemId));
        const priceInfoList = priceInfoListRaw.map(entry => ({
          token: entry.token.stringValue,
          tokenAmount: entry.tokenAmount.toString()
        }));
        priceInfo = priceInfoList[0];
      } catch (error) {
        console.error("Price Table Error:", error);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
      }

      if (priceInfo?.tokenAmount) {
        const raw = priceInfo.tokenAmount;
        const padded = raw.padStart(7, "0");
        const integerPart = padded.slice(0, -6);
        const decimalPart = padded.slice(-6).replace(/0+$/, "");
        setTokenAmount(decimalPart ? `${integerPart}.${decimalPart}` : integerPart);
      } else {
        setTokenAmount("");
      }
    })();
  }, [chainConfig, ludexConfig, game]);

  useEffect(() => {
    (async () => {
      const price = 1371 * game.price;
      setKrwAmount(price.toLocaleString());
    })();
  }, [game.price]);

  const handleConfirm = async () => {
    if (activeTab === "card") {
      alert("카드/계좌 결제가 처리되었습니다.");
      setIsFetch(true);
      onClose();
      return;
    }

    if (activeTab === "wallet") {
      if (!selectedWallet) {
        alert("지갑 주소를 선택해주세요.");
        return;
      }

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
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [chainConfig]
                });
              } catch (addError) {
                const nowChainId = await window.ethereum.request({ method: "eth_chainId" });
                if (nowChainId.toLowerCase() !== chainIdHex) {
                  alert("이더리움 네트워크 전환에 실패했습니다.");
                  onClose();
                  return;
                }
              }
            } else {
              onClose();
              return;
            }
          }
        }
      } catch (err) {
        console.error("MetaMask 네트워크 연결 실패:", err);
        return;
      }

      const connection = await ludex.BrowserWalletConnection.create(chainConfig);
      const address = (await connection.getCurrentAddress()).stringValue;

      if (address.toLowerCase() !== selectedWallet.toLowerCase()) {
        alert("MetaMask와 지갑 주소가 일치하지 않습니다.");
        onClose();
        return;
      }

      const signer = await connection.getSigner();
      const facade = ludex.facade.createWeb3UserFacade(chainConfig, ludexConfig, signer);
      const store = facade.metaTXAccessStore();

      const token = await (async () => {
        const tokenString = await getTokenAddress();
        return tokenString ? ludex.Address.create(tokenString) : undefined;
      })();

      if (!token) {
        console.log("No token.");
        onClose();
        return;
      }

      setIsUploading(true); // 로딩 시작

      let relayRequest;
      try {
        relayRequest = await store.purchaseItemRequest(BigInt(game.itemId), token, 30000000n);
      } catch (err) {
        console.log("relayRequest Error:", err);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
        setIsUploading(false);
        onClose();
        return;
      }

      const { args, error } = await requestRelay(relayRequest);

      if (error) {
        console.error("relay error:", error.message);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
        setIsUploading(false);
        onClose();
        return;
      }

      try {
        const resultArray = Array.isArray(args) ? args : [args];
        const purchaseId = relayRequest.onResponse(resultArray);
        const purchasedGame = {
          gameId: game.id,
          pricePaid: game.price.toString(),
          isNftIssued: true,
          purchaseId: purchaseId.toString()
        };

        const message = await registerPurchase(purchasedGame);
        console.log(message);
      } catch (error) {
        console.log("Register Purchase Error:", error);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
        setIsUploading(false);
        onClose();
        return;
      }

      setIsUploading(false); // 로딩 끝
      setIsFetch(true);
      alert("지갑 결제가 처리되었습니다.");
      onClose();
    }
  };

  return (
    <>
      {isUploading && <LoadingModal />} {/* 로딩 모달 조건부 렌더링 */}
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
              <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()} $에 구매하시겠습니까?</p>
              <form className="payment-form">
                <label>카드 번호<input type="text" placeholder="1234 5678 9012 3456" /></label>
                <label>유효기간<input type="text" placeholder="MM/YY" /></label>
                <label>CVC<input type="text" placeholder="123" /></label>
                <label>결제자 이름<input type="text" placeholder="홍길동" /></label>
                <label>결제자 이메일<input type="email" placeholder="email@example.com" /></label>
              </form>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="payment-tab-content">
              <p><strong>{game.title}</strong>을(를) {tokenAmount} USDC에 구매하시겠습니까?</p>
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
    </>
  );
};

export default PaymentModal;