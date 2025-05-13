import uploadInstance from "./Instance/uploadFileInstance";

// 게임 다운로드
export const downloadGame = async ({ gameId }) => {
  try {
    const response = await uploadInstance.get(`/protected/game/download/${gameId}`);
    console.log("게임 다운로드 링크 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("게임 다운로드 링크 조회 실패:", error);
    throw error;
  }
};

// 리소스 다운로드
export const downloadResource = async ({ resourceId }) => {
  try {
    const response = await uploadInstance.get(`/protected/resource/download/${resourceId}`);
    console.log("리소스 다운로드 링크 조회: ", response.data);
    return response.data;
  } catch (error) {
    console.error("리소스 다운로드 링크 조회 실패:", error);
    throw error;
  }
};
