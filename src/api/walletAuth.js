import web3Instance from "./web3GatewayInstance";

export const registerGame = async (item) => {
  try {
  const res = await web3Instance.post("/protected/auth/siwe", item);
  return res.message;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    alert(`실패: ${msg}`);
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
    alert(`실패: ${msg}`);
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
    alert(`실패: ${msg}`);
  }
};