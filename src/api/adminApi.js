import platformAdminInstance from "./Instance/platformAdminInstance";

export const postReport = async (report) => {
  try {
    const response = await platformAdminInstance.post("/protected/report/post", report);
    return response.data;
  } catch (error) {
    console.error("신고 처리 실패:", error);
    throw error;
  }
};