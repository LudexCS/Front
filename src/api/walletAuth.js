import web3Instance from "./Instance/web3GatewayInstance";
import * as ludex from "ludex";

export const claimPurchase = async ({ ownerId, ownerAddress, purchaseId }) => {
  try {
    const res = await web3Instance.post("/protected/delegate/claim-purchase", {
      ownerId,
      ownerAddress,
      purchaseId,
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    return { error: msg };
  }
}

export const requestRelay = async (relayRequest) => {
  try {
    const body = ludex.relay.serializeRelayRequest(relayRequest);
    console.log("requestRelay body: ", body);
    const res = await web3Instance.post("/relay", body, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
    return { error: msg };
  }
}

export const getConfig = async () => {
  try {
    const res = await web3Instance.get("/config/get");
    const { chainConfig, ludexConfig } = res.data;
    return { chainConfig, ludexConfig };
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
    return { error: msg };
  }
};

export const getTokenAddress = async () => {
  try {
    const res = await web3Instance.get("/token/get/address");
    return res.data.tokenAddress;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
    return { error: msg };
  }
};

export const registerGame = async (item) => {
  try {
  const res = await web3Instance.post("/protected/register/item", item);
  return res.message;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
    return { error: msg };
  }
};

// step 1: nonce 요청(사용자인증)
export const requestWalletNonce = async ({address, url}) => {
  try {
  const res = await web3Instance.post("/protected/auth/siwe", {
    address,
    url,
  });
  console.log("nonce 요청(사용자인증) 반환", res);
  return res.data.message;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
    return { error: msg };
  }
};

// step 2~3: 서명 → 검증
export const verifyWalletOwnership = async ({ address, signature }) => {
  try{
    const res = await web3Instance.post("/protected/auth/wallet", {
    address,
    signature,
    });
    return res.data.message;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert("서버 혼잡 에러입니다. 잠시 후 다시 시도해주세요.");
    return { error: msg };
  }
};