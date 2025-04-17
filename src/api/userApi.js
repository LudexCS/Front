import axiosInstance from "./axiosInstance";

// 회원 정보를 가져오는 API
export const getUserData = async () => {
  try {
    // axiosInstance가 자동으로 Authorization 헤더를 처리합니다.
    const response = await axiosInstance.get("/protected/account/get");
    return response.data;
  } catch (error) {
    console.error("회원 정보를 가져오는 데 실패했습니다", error);
    throw error;
  }
};