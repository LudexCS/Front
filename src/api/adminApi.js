import platformAdminInstance from "./Instance/platformAdminInstance";
import gameManageInstance from "./Instance/gameManageInstance";

const page = 1;

export const postReport = async (report) => {
  try {
    const response = await platformAdminInstance.post("/protected/report/post", report);
    return response.data;
  } catch (error) {
    console.error("신고 처리 실패:", error);
    throw error;
  }
};

// 검색어로 필터링된 게임 목록 조회(정지된 게임 포함)
export const adminGamesByKeyword = async (keyword) => {
  try {
    const response = await gameManageInstance.post("/admin/get/search", {
      keyword,
    });
    console.log("관리자) 게임 목록 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("관리자) 게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};

// 신고 목록 조회
export const adminGetReportList = async (isHandled) => {
  try {
    const response = await platformAdminInstance.get("/admin/report/getList", {
       params: {
        handled: isHandled,
        page: page,
      },
    });
    console.log("관리자) 신고 목록 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("관리자) 신고 목록을 가져오는데 실패:", error);
    throw error;
  }
};

// 신고 처리
export const adminHandleReport = async (reportId) => {
  try {
    const response = await platformAdminInstance.post("admin/report/handleReport", {reportId});
    console.log("관리자) 신고 처리: ", response.data);
    return response.data;
  } catch (error) {
    console.error("관리자) 신고 처리에 실패:", error);
    throw error;
  }
};