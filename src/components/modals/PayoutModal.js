import React, {useEffect, useState} from "react";
import "../../styles/modals/PayoutModal.css";
import { useUser } from "../../context/UserContext";
import { useConfig } from "../../context/ConfigContext";
import * as ludex from "ludex";
import { getTokenAddress, requestRelay } from "../../api/walletAuth";
import LoadingModal from "./LoadingModal";

const PayoutModal = ({ isOpen, onClose, sales }) => {
  const { user } = useUser();
  const { chainConfig, ludexConfig } = useConfig();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gamesBalance, setGamesBalance] = useState([]);
  const [resourcesBalance, setResourcesBalance] = useState([]);
  const [gameBalance, setGameBalance] = useState(null);
  const [resourceBalance, setResourceBalance] = useState(null);

  useEffect(() => {
    (async () => {
      let gamesBalance = [];

      if (Array.isArray(sales.games)) {
        gamesBalance = await Promise.all(
            sales.games.map(async (game) => {
              try {
                const profitEscrow =
                    ludex
                        .facade
                        .createWeb2UserFacade(chainConfig, ludexConfig)
                        .readonlyAccessProfitEscrow();

                const tokenAddress = await getTokenAddress();
                if (!tokenAddress) {
                  alert("토큰 주소를 가져오지 못했습니다.");
                  return 0;
                }

                const itemId = BigInt(game.itemId);

                let balance = (
                    await profitEscrow.getBalanceFor(
                        itemId,
                        ludex.Address.create(tokenAddress)
                    )
                ).toString();

                const padded = balance.padStart(7, "0");
                const integerPart = padded.slice(0, -6);
                const decimalPart = padded.slice(-6).replace(/0+$/, "");
                balance = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;

                console.log(`GameId ${itemId} Game Balance: ${balance} USDC`);
                return balance;
              } catch (error) {
                //alert("정산할 금액을 가져오지 못했습니다.");
                console.log("Balance Error:", error.message);
                return 0;
              }
            })
        );
      }
      setGamesBalance(gamesBalance);
    })();
  }, [sales.games?.length, isOpen]);

  useEffect(() => {
    (async () => {
      let resourcesBalance = [];

      if (Array.isArray(sales.resources)) {
        resourcesBalance = await Promise.all(
            sales.resources.map(async (resource) => {
              try {
                const profitEscrow =
                    ludex
                        .facade
                        .createWeb2UserFacade(chainConfig, ludexConfig)
                        .readonlyAccessProfitEscrow();

                const tokenAddress = await getTokenAddress();
                if (!tokenAddress) {
                  alert("토큰 주소를 가져오지 못했습니다.");
                  return 0;
                }

                const sharerId = resource.sharerId;
                console.log("sharerId: " + sharerId);
                if (!sharerId) {
                  return 0;
                }

                const itemId = BigInt(sharerId);

                let balance = (
                    await profitEscrow.getBalanceFor(
                        itemId,
                        ludex.Address.create(tokenAddress)
                    )
                ).toString();

                const padded = balance.padStart(7, "0");
                const integerPart = padded.slice(0, -6);
                const decimalPart = padded.slice(-6).replace(/0+$/, "");
                balance = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;

                console.log(`SharerId ${sharerId} Resource Balance: ${balance} USDC`);
                return balance;
              } catch (error) {
                //alert("정산할 리소스 금액을 가져오지 못했습니다.");
                console.log("Resource Balance Error:", error.message);
                return 0;
              }
            })
        );
      }
      setResourcesBalance(resourcesBalance);
    })();
  }, [sales.resources?.length, isOpen])

  const handlePayoutConfirm = async () => {
    if (!selectedGameId) {
      alert("정산을 받을 게임을 선택해주세요.");
      return;
    }
    if (!selectedWallet) {
      alert("정산을 받을 지갑을 선택해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 시작
    console.log("정산 요청된 게임 item 아이디:", selectedGameId);
    console.log("정산 요청된 리소스 아이디:", selectedResourceId);
    console.log("정산 요청된 지갑 주소:", selectedWallet);

    const chainIdHex = chainConfig.chainId.toLowerCase();

    let connection;
    let address;

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
              console.warn("Add chain failed:", addError);
              const nowChainId = await window.ethereum.request({ method: "eth_chainId" });
              if (nowChainId.toLowerCase() !== chainIdHex) {
                alert("이더리움 네트워크 전환에 실패했습니다.");
                setIsLoading(false);
                return;
              }
            }
          } else {
            setIsLoading(false);
            throw switchError;
          }
        }
      }

      connection = await ludex.BrowserWalletConnection.create(chainConfig);
      address = (await connection.getCurrentAddress()).stringValue;
    } catch (err) {
      console.error("MetaMask 네트워크 연결 실패:", err);
      alert("MetaMask 등록 후 다시 시도해주세요.");
      setIsLoading(false);
      return;
    }

    if (address.toLowerCase() !== selectedWallet.toLowerCase()) {
      alert("MetaMask와 지갑 주소가 일치하지 않습니다. 주소를 확인해주세요.");
      setIsLoading(false);
      return;
    }

    const tokenAddress = await getTokenAddress();
    if (!tokenAddress) {
      alert("토큰 주소를 가져오지 못했습니다.");
      setIsLoading(false);
      return;
    }

    const signer = await connection.getSigner();

    let profitEscrow;
    try {
      profitEscrow =
          ludex
              .facade
              .createWeb3UserFacade(
                  chainConfig,
                  ludexConfig,
                  signer)
              .metaTXAcessProfitEscrow();
    } catch (error) {
      console.log("Payment Error: " + error);
      alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
      setIsLoading(false);
      return;
    }

    const itemId = BigInt(selectedGameId);
    if (selectedResourceId) {
      if (Number(resourceBalance) > 0) {
        console.log("Resource Relay Requesting ..");
        const sharerId = BigInt(selectedResourceId);
        let relayRequest;
        try {
          relayRequest =
              await profitEscrow.claimRequest(
                  sharerId,
                  ludex.Address.create(tokenAddress),
                  await connection.getCurrentAddress(),
                  3000000n);
        } catch (error) {
          console.log("Relay Request Error: " + error);
          alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
          setIsLoading(false);
          onClose();
          return;
        }

        const { args, error } = await requestRelay(relayRequest);

        if (error) {
          console.error(`message: ${error.message}`);
          alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
          setIsLoading(false);
          onClose();
          return;
        }
      }
    }

    if (Number(gameBalance) > 0) {
      console.log("Game Relay Requesting ..");

      let relayRequest;
      try {
        relayRequest =
            await profitEscrow.claimRequest(
                itemId,
                ludex.Address.create(tokenAddress),
                await connection.getCurrentAddress(),
                3000000n);
      } catch (error) {
        console.log("Relay Request Error: " + error);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
        setIsLoading(false);
        onClose();
        return;
      }

      const { args, error } = await requestRelay(relayRequest);

      if (error) {
        console.error(`message: ${error.message}`);
        alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
        setIsLoading(false);
        onClose();
        return;
      }
    }

    setIsLoading(false); // 로딩 종료
    alert("정산 요청이 처리되었습니다.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {isLoading && <LoadingModal />}
      <div className="payout-modal-overlay" onClick={onClose}>
        <div className="payout-modal" onClick={(e) => e.stopPropagation()}>
          <h2>정산 요청</h2>
          <p>정산 할 게임을 선택해주세요:</p>
          <div className="payout-sales-summary-wrapper">
            {sales.games.map((game, index) => (
              <div key={game.itemId} className="payout-sales-summary">
                <li 
                  className={game.itemId === selectedGameId ? "selected" : ""}
                  onClick={() => {
                    setSelectedGameId(game.itemId);
                    setSelectedResourceId(sales.resources[index].sharerId);
                    setGameBalance(gamesBalance[index]);
                    setResourceBalance(resourcesBalance[index]);
                  }}
                >
                  <img src={game.thumbnailUrl} alt="payout-thumbnail-img" className="payout-thumbnail-img" />
                  <div>
                    <span>{game.title}</span>
                    <span>game revenue: {gamesBalance[index] ?? "..."} USDC</span> {/* 해당 게임의 정산할 금액 */}
                    <span>resource revenue: {resourcesBalance[index] ?? "..."} USDC</span> {/* 해당 리소스의 정산할 금액 */}
                  </div>
                </li>
              </div>
            ))}
          </div>
          <p>게임 등록 시 선택한 지갑을 선택해주세요:</p>
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
          <p className="wallet-notice">* 게임 등록 시 선택한 지갑을 선택하지 않을 시 정산 중 오류가 발생합니다.</p>
          <div className="payout-actions">
            <button className="payout-confirm-btn" onClick={handlePayoutConfirm}>정산 요청</button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutModal;