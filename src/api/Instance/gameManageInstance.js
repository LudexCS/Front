import axios from "axios";
// import { getNewAccessToken } from "../userApi";

const gameManageInstance = axios.create({
  baseURL: "https://api.uosludex.com/management/api",
  withCredentials: true,
});

// 요청 시 access token 자동 첨부
gameManageInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 에러 발생 시 토큰 재발급 시도
// gameManageInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const { newToken } = await getNewAccessToken();
//         localStorage.setItem("accessToken", newToken);
//         originalRequest.headers.authorization = `Bearer ${newToken}`;
//         return gameManageInstance(originalRequest);
//       } catch (err) {
//         console.error("refresh token으로 갱신 실패:", err);
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default gameManageInstance;