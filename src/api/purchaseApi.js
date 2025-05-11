import purchaseInstance from "./Instance/purchaseInstance";

// 게임 구매
export const purchaseGame = async ({ gameId, pricePaid, isNftIssued, purchaseId }) => {
  try {
    const response = await purchaseInstance.post(
      "/protected/register/game/purchase",
      { gameId, pricePaid, isNftIssued, purchaseId }
    );
    console.log("게임 구매 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.error("게임 구매 실패:", error);
    throw error;
  }
};

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