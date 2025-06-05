import platformAdminInstance from "./Instance/platformAdminInstance";
import gameManageInstance from "./Instance/gameManageInstance";

const page = 1;

function sanitizeFilename(name) {
  return name.replace(/[^\w.-]+/g, "_"); // 한글, 공백, 특수문자 제거
}

export const addBanner = async (banner, image) => {
  const formData = new FormData();

  console.log("json: ", banner);
  formData.append("json", JSON.stringify(banner));

  if (image?.file instanceof File) {
    const safeThumb = new File(
      [image.file],
      sanitizeFilename(image.file.name),
      { type: image.file.type }
    );
    formData.append("imageUrl", safeThumb);
  }

  // // 디버깅 로그
  // for (const [key, value] of formData.entries()) {
  //   if (value instanceof File) {
  //     console.log(`[FormData] ${key}: ${value.name}, ${value.size} bytes`);
  //   } else {
  //     console.log(`[FormData] ${key}:`, value);
  //   }
  // }

  try {
    const response = await platformAdminInstance.post("/admin/banner/create", formData);
    return response.data;
  } catch (error) {
    console.error("배너 등록 실패:", error);
    throw error;
  }
};

export const postReport = async (report) => {
  try {
    const response = await platformAdminInstance.post("/protected/report/post", report);
    return response.data;
  } catch (error) {
    console.error("신고 처리 실패:", error);
    throw error;
  }
};

export const postGameBlocked = async (gameId) => {
  try {
    const response = await platformAdminInstance.post("/admin/sanction/game", {
      adminEmail: "admin@admin.com",
      gameId: gameId,
      sanctionDetail: ""
    });
    return response.data;
  } catch (error) {
    console.error("게임 차단 처리 실패:", error);
    throw error;
  }
};

export const postGameUnblocked = async (gameId) => {
  try {
    const response = await platformAdminInstance.post("/admin/sanction/free/game", {
      gameId: gameId
    });
    return response.data;
  } catch (error) {
    console.error("게임 차단 해제 실패:", error);
    throw error;
  }
};

export const postUserBlocked = async (userEmail) => {
  try {
    const response = await platformAdminInstance.post("/admin/sanction/user", {
      adminEmail: "admin@admin.com",
      userEmail: userEmail,
      sanctionDetail: ""
    });
    return response.data;
  } catch (error) {
    console.error("유저 차단 처리 실패:", error);
    throw error;
  }
};

export const postUserUnblocked = async (userEmail) => {
  try {
    const response = await platformAdminInstance.post("/admin/sanction/free/user", {
      email: userEmail
    });
    return response.data;
  } catch (error) {
    console.error("유저 차단 해제 실패:", error);
    throw error;
  }
};

export const postUserEmail = async (userEmail, content) => {
  try {
    const response = await platformAdminInstance.post("/admin/send/email", {
      userEmail: userEmail,
      content: content
    });
    return response.data;
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    throw error;
  }
};

export const getUsersList = async () => {
  try {
    const response = await platformAdminInstance.get("/admin/user/usersList");
    return response.data;
  } catch (error) {
    console.error("유저 목록 조회 실패:", error);
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

export const adminUnhandleReport = async (reportId) => {
  try {
    const response = await platformAdminInstance.post("/admin/report/unHandleReport", {reportId});
    console.log("관리자) 신고 미처리: ", response.data);
    return response.data;
  } catch (error) {
    console.error("관리자) 신고 미처리 변경에 실패:", error);
    throw error;
  }
};