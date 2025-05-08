// src/api/recordApi.js
// import gameManageInstance from "./Instance/gameManageInstance";
import axios from "axios";

export const getTradeInfo = async (email) => {
  try {
    const res = await axios.get("http://3.37.46.45:30353/api/tradeInfo", {
      data: { email },
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error("getTradeInfo 호출 실패:", msg);
    throw err;
  }
};