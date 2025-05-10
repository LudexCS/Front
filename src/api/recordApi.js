// src/api/recordApi.js
import gameManageInstance from "./Instance/gameManageInstance";

export const getTradeInfo = async () => {
  try {
    const response = await gameManageInstance.get("/protected/get/tradeInfo");
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error("getTradeInfo 호출 실패:", msg);
    throw err;
  }
};