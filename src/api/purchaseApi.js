import purchaseInstance from "./Instance/purchaseInstance";

export const registerPurchase = async (purchasedGame) => {
    try {
        const res = await purchaseInstance.post("/protected/register/game/purchase", purchasedGame);
        return res.data.message;
    } catch (err) {
        const msg = err.response?.data?.message || err.message;
        alert(`실패: ${msg}`);
    }
}

// 리소스 구매
export const purchaseResource = async ({ resourceId }) => {
  try {
    const response = await purchaseInstance.post(
      "/protected/register/resource/contract",
      { resourceId }
    );
    console.log("리소스 구매 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.error("리소스 구매 실패:", error);
    throw error;
  }
};