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