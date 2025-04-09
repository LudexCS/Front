// src/api/axiosInstance.js
import axios from "axios";
import { getNewAccessToken } from "./auth";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// 요청 시 access token 붙이기
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답에서 401 발생 시 refresh token으로 갱신 시도
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await getNewAccessToken();
        localStorage.setItem("accessToken", newToken.accessToken);
        originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
        return instance(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;