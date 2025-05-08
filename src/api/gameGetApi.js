import gameManageInstance from "./Instance/gameManageInstance";

//페이지별 게임 목록 조회
export const fetchGameList = async ({ page, limit }) => {
  try {
    const response = await gameManageInstance.get("/games/get/list", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};

//원본,파생 게임 목록 조회
export const fetchOriginVariantGameList = async ({ title }) => {
  try {
    const response = await gameManageInstance.get("/games/get/origin", {
      params: { title },
    });
    return response.data;
  } catch (error) {
    console.error("원본/파생 게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};

//태그로 필터링된 게임 목록 조회
export const fetchGamesByTags = async ({ tags }) => {
  try {
    const response = await gameManageInstance.post("/games/get/byTags", {
      tags,
    });
    return response.data;
  } catch (error) {
    console.error("태그 기반 게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};

//게임 상세 정보 조회
export const fetchGameDetail = async ({ title }) => {
  try {
    const response = await gameManageInstance.get("/games/get/gameDetail", {
      params: { title },
    });
    return response.data;
  } catch (error) {
    console.error("게임 상세 정보를 가져오는데 실패:", error);
    throw error;
  }
};
