// src/api/recordApi.js
import gameManageInstance from "./Instance/gameManageInstance";

export const getTradeInfo = async () => {
  try {
    const response = await gameManageInstance.get("/protected/get/tradeInfo");
    console.log("거래내역: ", response.data);
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error("getTradeInfo 호출 실패:", msg);
    throw err;
  }
};

export const setDiscountGame = async (discount) => {
  console.log("discount", discount);
  try {
    await gameManageInstance.post("/protected/discount/register", discount);
  } catch (err) {
    console.error("할인 설정 실패:", err);
    throw err;
  }
};

export const setReductionGame = async (reduction) => {
  console.log("reduction", reduction);
  try {
    await gameManageInstance.post("/protected/reduction/register", reduction);
  } catch (err) {
    console.error("감소 설정 실패:", err);
    throw err;
  }
}