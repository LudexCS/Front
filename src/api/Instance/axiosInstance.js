import axios from "axios";
// import { getNewAccessToken } from "../../api/userApi";

const instance = axios.create({
  baseURL:  "http://api.uosludex.com/useraccount/api",
  withCredentials: true,
});

// 요청 시 access token 붙이기
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = {
      ...config.headers,
      authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// 응답에서 401 발생 시 refresh token으로 갱신 시도
// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {//토큰 둘다 업뎃
//         const { newToken } = await getNewAccessToken();
//         localStorage.setItem("accessToken", newToken);
//         console.log("newToken: ", newToken);
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return instance(originalRequest);
//       } catch (err) {
//         console.log("refresh token으로 갱신 오류: ", err);
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;