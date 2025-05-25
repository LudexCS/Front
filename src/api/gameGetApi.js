import axios from "axios";

//페이지별 게임 목록 조회
export const fetchGameList = async ({ page, limit }) => {
  try {
    const response = await axios.get("http://16.184.9.194:30353/api/get/list", {
      params: { page, limit },
    });
    console.log("페이지별 게임 목록 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};
 
//원본 게임 목록 조회
export const fetchOriginGameList = async ({ gameId }) => {
  try {
    const response = await axios.get("http://16.184.9.194:30353/api/get/origin", {
      params: { gameId },
    });
    // console.log("원본 게임 목록 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("원본 게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};

//파생 게임 목록 조회
export const fetchVariantGameList = async ({ gameId }) => {
  try {
    const response = await axios.get("http://16.184.9.194:30353/api/get/variant", {
      params: { gameId },
    });
    // console.log("파생 게임 목록 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("파생 게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};

//태그로 필터링된 게임 목록 조회
// export const fetchGamesByTags = async ({ tags }) => {
//   try {
//     const response = await axios.post("http://16.184.9.194:30353/api/get/byTags", {
//       tags,
//     });
//     console.log("태그 필터링된 게임 목록 조회: ", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("태그 기반 게임 목록을 가져오는데 실패:", error);
//     throw error;
//   }
// };

//검색어로 필터링된 게임 목록 조회
export const fetchGamesByKeyword = async (keyword) => {
  try {
    const response = await axios.post("http://16.184.9.194:30353/api/get/search", {
      keyword,
    });
    console.log("검색어 필터링된 게임 목록 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("검색어 기반 게임 목록을 가져오는데 실패:", error);
    throw error;
  }
};

//게임 상세 정보 조회
export const fetchGameDetail = async ({ gameId }) => {
  try {
    const response = await axios.get("http://16.184.9.194:30353/api/get/gameDetail", {
      params: { gameId },
    });
    console.log("게임 상세 정보 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("게임 상세 정보를 가져오는데 실패:", error);
    throw error;
  }
};

//게임 리소스 정보 조회
export const fetchGameResource = async ({ gameId }) => {
  try {
    const response = await axios.get("http://16.184.9.194:30353/api/get/resourceDetail", {
      params: { gameId },
    });
    console.log("게임 리소스 정보 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("게임 리소스 정보를 가져오는데 실패:", error);
    throw error;
  }
};