import React, { useEffect, useState } from "react";
import "../../styles/modals/PaymentModal.css";
import { useUser } from "../../context/UserContext";
import { useConfig } from "../../context/ConfigContext";
import { useRecord } from "../../context/RecordContext";
import * as ludex from "ludex";
import { getTokenAddress, requestRelay } from "../../api/walletAuth";
import {registerPurchase, savePaymentInfo} from "../../api/purchaseApi";
import LoadingModal from "./LoadingModal";
import sha256 from "crypto-js/sha256";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

const PaymentModal = ({ game, onClose }) => {
  const [activeTab, setActiveTab] = useState("wallet");
  const { user } = useUser();
  const { chainConfig, ludexConfig } = useConfig();
  const { setIsFetch } = useRecord();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [tokenAmount, setTokenAmount] = useState("");
  const [krwAmount, setKrwAmount] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // 추가됨
  const [payment, setPayment] = useState(null);

  const clientKey = "test_ck_26DlbXAaV07qqeZgpLzd3qY50Q9R";
  const customerKey = `user_${sha256(`constant-salt-${user.id}`).toString().slice(0, 20)}`;

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
      // toss는 소수점 원화를 허락하지 않음. 반올림으로 정수화 - 논의 필요.
      const price = Math.round(1371 * game.price);
      setKrwAmount(price);
    })();
  }, [game.price]);

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
        const payment = tossPayments.payment({
          customerKey,
        });
        // 비회원 결제
        // const payment = tossPayments.payment({ customerKey: ANONYMOUS });

        setPayment(payment);
      } catch (error) {
        alert("Toss Payments SDK 로딩 실패");
        console.error("Error fetching payment:", error);
      }
    }

    fetchPayment();
  }, [clientKey, customerKey]);

const handleConfirm = async () => {
    const orderId = generateOrderId();
    const amount = krwAmount;

    switch (activeTab) {
      case "CARD":
        setIsUploading(true);

        // 결제 전 결제 정보 저장
        try {
          await savePaymentInfo({ orderId, amount });
        } catch (error) {
          alert("결제에 실패했습니다. 다시 시도해주세요.");
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }

        try {
          await payment.requestPayment({
            method: "CARD", // 카드 및 간편결제
            amount: {
              currency: "KRW",
              value: krwAmount,
            },
            orderId: orderId,
            orderName: game.title,
            successUrl: window.location.origin + "/payment/success",
            failUrl: window.location.origin + "/payment/fail",
            customerEmail: user.email,
            customerName: user.nickname,
            card: {
              useEscrow: false,
              flowMode: "DEFAULT",
              useCardPoint: false,
              useAppCardOnly: false,
            },
          });
        } catch (error) {
          console.error("Toss Payments 결제 취소:", error);
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }
        // 이 밑 코드는 실행되지 않음.
      case "TRANSFER":
        setIsUploading(true);

        // 결제 전 결제 정보 저장
        try {
          await savePaymentInfo({ orderId, amount });
        } catch (error) {
          alert("결제에 실패했습니다. 다시 시도해주세요.");
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }

        try {
          await payment.requestPayment({
            method: "TRANSFER",  // 계좌이체 결제
            amount: {
              currency: "KRW",
              value: krwAmount,
            },
            orderId: orderId,
            orderName: game.title,
            successUrl: window.location.origin + "/payment/success",
            failUrl: window.location.origin + "/payment/fail",
            customerEmail: user.email,
            customerName: user.nickname,
            customerMobilePhone: "01012341234",
            transfer: {
              cashReceipt: {
                type: "소득공제",
              },
              useEscrow: false,
            },
          });
        } catch (error) {
          console.error("Toss Payments 결제 취소:", error);
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }
        // 이 밑 코드는 실행되지 않음.
      case "VIRTUAL_ACCOUNT":
        setIsUploading(true);

        // 결제 전 결제 정보 저장
        try {
          await savePaymentInfo({ orderId, amount });
        } catch (error) {
          alert("결제에 실패했습니다. 다시 시도해주세요.");
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }

        try {
          await payment.requestPayment({
            method: "VIRTUAL_ACCOUNT",
            amount: {
              currency: "KRW",
              value: krwAmount,
            },
            orderId: orderId,
            orderName: game.title,
            successUrl: window.location.origin + "/payment/success",
            failUrl: window.location.origin + "/payment/fail",
            customerEmail: user.email,
            customerName: user.nickname,
            customerMobilePhone: "01012341234",
            virtualAccount: {
              cashReceipt: {
                type: "소득공제",
              },
              useEscrow: false,
              validHours: 24,
            },
          });
        } catch (error) {
          console.error("Toss Payments 결제 취소:", error);
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }
        // 이 밑 코드는 실행되지 않음.
      case "MOBILE_PHONE":
        setIsUploading(true);

        // 결제 전 결제 정보 저장
        try {
          await savePaymentInfo({ orderId, amount });
        } catch (error) {
          alert("결제에 실패했습니다. 다시 시도해주세요.");
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }

        try {
          await payment.requestPayment({
            method: "MOBILE_PHONE", // 휴대폰 결제
            amount: {
              currency: "KRW",
              value: krwAmount,
            },
            orderId: orderId,
            orderName: game.title,
            successUrl: window.location.origin + "/payment/success",
            failUrl: window.location.origin + "/payment/fail",
            customerEmail: user.email,
            customerName: user.nickname,
          });
        } catch (error) {
          console.error("Toss Payments 결제 취소:", error);
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }
        // 이 밑 코드는 실행되지 않음.
      case "CULTURE_GIFT_CERTIFICATE":
        setIsUploading(true);

        // 결제 전 결제 정보 저장
        try {
          await savePaymentInfo({ orderId, amount });
        } catch (error) {
          alert("결제에 실패했습니다. 다시 시도해주세요.");
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }

        try {
          await payment.requestPayment({
            method: "CULTURE_GIFT_CERTIFICATE", // 문화상품권 결제
            amount: {
              currency: "KRW",
              value: krwAmount,
            },
            orderId: orderId,
            orderName: game.title,
            successUrl: window.location.origin + "/payment/success",
            failUrl: window.location.origin + "/payment/fail",
            customerEmail: user.email,
            customerName: user.nickname,
          });
        } catch (error) {
          console.error("Toss Payments 결제 취소:", error);
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }
        // 이 밑 코드는 실행되지 않음.
      case "FOREIGN_EASY_PAY":
        setIsUploading(true);

        const usdAmount = Number(game.price);

        // 결제 전 결제 정보 저장
        try {
          await savePaymentInfo({ orderId, amount: usdAmount });
        } catch (error) {
          alert("결제에 실패했습니다. 다시 시도해주세요.");
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }

        try {
          await payment.requestPayment({
            method: "FOREIGN_EASY_PAY", // 해외 간편결제
            amount: {
              currency: "USD",
              value: Number(game.price),
            },
            orderId: orderId,
            orderName: game.title,
            successUrl: window.location.origin + "/payment/success",
            failUrl: window.location.origin + "/payment/fail",
            customerEmail: user.email,
            customerName: user.nickname,
            foreignEasyPay: {
              provider: "PAYPAL", // PayPal 결제
              country: "KR",
            },
          });
        } catch (error) {
          console.error("Toss Payments 결제 취소:", error);
          setIsUploading(false);
          setIsFetch(true);
          onClose();
          break;
        }
        // 이 밑 코드는 실행되지 않음.
      case "WALLET":
        if (!selectedWallet) {
          alert("지갑 주소를 선택해주세요.");
          return;
        }
        {
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

          setIsUploading(true);

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

          setIsUploading(false);
          setIsFetch(true);
          alert("지갑 결제가 처리되었습니다.");
          onClose();
        }
        break;
      default:
        alert("지원하지 않는 결제 방식입니다.");
        break;
    }
  };

  return (
    <>
      {isUploading && <LoadingModal />} {/* 로딩 모달 조건부 렌더링 */}
      <div className="payment-modal-overlay">
        <div className="payment-modal-content payment-modal">
          <h3 className="payment-title">결제 방법 선택</h3>
          <div className="payment-tab-buttons">
            <button className={`tab-btn ${activeTab === "WALLET" ? "active" : ""}`} onClick={() => setActiveTab("WALLET")}>전자지갑 결제</button>
            <button className={`tab-btn ${activeTab === "CARD" ? "active" : ""}`} onClick={() => setActiveTab("CARD")}>카드 결제</button>
            <button className={`tab-btn ${activeTab === "TRANSFER" ? "active" : ""}`} onClick={() => setActiveTab("TRANSFER")}>계좌이체</button>
            <button className={`tab-btn ${activeTab === "VIRTUAL_ACCOUNT" ? "active" : ""}`} onClick={() => setActiveTab("VIRTUAL_ACCOUNT")}>가상 계좌</button>
            <button className={`tab-btn ${activeTab === "MOBILE_PHONE" ? "active" : ""}`} onClick={() => setActiveTab("MOBILE_PHONE")}>휴대폰</button>
            <button className={`tab-btn ${activeTab === "CULTURE_GIFT_CERTIFICATE" ? "active" : ""}`} onClick={() => setActiveTab("CULTURE_GIFT_CERTIFICATE")}>문화상품권</button>
            <button className={`tab-btn ${activeTab === "FOREIGN_EASY_PAY" ? "active" : ""}`} onClick={() => setActiveTab("FOREIGN_EASY_PAY")}>해외간편결제</button>
          </div>

          {activeTab === "CARD" && (
            <div className="payment-tab-content">
              <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()} $에 구매하시겠습니까?</p>
            </div>
          )}

          {activeTab === "TRANSFER" && (
              <div className="payment-tab-content">
                <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()} $에 구매하시겠습니까?</p>
              </div>
          )}

          {activeTab === "VIRTUAL_ACCOUNT" && (
              <div className="payment-tab-content">
                <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()} $에 구매하시겠습니까?</p>
              </div>
          )}

          {activeTab === "MOBILE_PHONE" && (
              <div className="payment-tab-content">
                <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()} $에 구매하시겠습니까?</p>
              </div>
          )}

          {activeTab === "CULTURE_GIFT_CERTIFICATE" && (
              <div className="payment-tab-content">
                <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()} $에 구매하시겠습니까?</p>
              </div>
          )}

          {activeTab === "FOREIGN_EASY_PAY" && (
              <div className="payment-tab-content">
                <p><strong>{game.title}</strong>을(를) {game.price.toLocaleString()} $에 구매하시겠습니까?</p>
              </div>
          )}

          {activeTab === "WALLET" && (
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
            <button className="confirm-btn" onClick={handleConfirm}>결제</button>
            <button className="cancel-btn" onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </>
  );
};

function generateOrderId() {
  return "ORDER-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
}

export default PaymentModal;