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

// 결제 전 결제 정보 저장
export const savePaymentInfo = async ({ orderId, amount }) => {
    try {
        const response = await purchaseInstance.post(
            "/protected/payment/before",
            { orderId, amount }
        );
        console.log("결제 정보 저장 성공: ", response.data);
        return response.data;
    } catch (error) {
        console.error("결제 정보 저장 실패:", error);
        throw error;
    }
};

// 결제 confirm
export const confirmPayment = async ({ paymentKey, orderId, amount }) => {
    const requestData = { paymentKey, orderId, amount };

    try {
        const response = await purchaseInstance.post(
            "/protected/payment/confirm",
            requestData
        );

        const json = response.data;

        if (response.status !== 200) {
            const message = json.message || "Unknown error";
            const code = json.code || "UNKNOWN";
            const err = new Error(message);
            err.code = code;
            throw err;
        }

        return json;
    } catch (error) {
        console.error("결제 확인 실패:", error);
        throw error;
    }
}