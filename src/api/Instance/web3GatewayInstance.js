import axios from 'axios';
// import { getNewAccessToken } from "../../api/userApi";

const web3Instance = axios.create({
  baseURL: "http://16.184.9.194:30352/api",
  withCredentials: true,
});


// 요청 시 access token 붙이기
web3Instance.interceptors.request.use((config) => {
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
// web3Instance.interceptors.response.use(
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
//         return web3Instance(originalRequest);
//       } catch (err) {
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default web3Instance;