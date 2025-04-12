import axiosInstance from "./axiosInstance";

// step 1: nonce 요청
export const requestWalletNonce = async (userId) => {
  const res = await axiosInstance.post("/nonce", { userId });
  return res.data.nonce;
};

// step 2~3: 서명 → 검증
export const verifyWalletOwnership = async ({ userId, address, signature }) => {
  const res = await axiosInstance.post("/link-wallet", {
    userId,
    address,
    signature,
  });
  return res.data.success;
};