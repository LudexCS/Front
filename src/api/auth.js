// src/api/auth.js 토큰 갱신 API 추가
import axiosInstance from "./axiosInstance";

export const loginUser = async (id, password) => {
  const response = await axiosInstance.post("/auth/login", { id, password });
  return response.data;
};

export const getNewAccessToken = async () => {
  const response = await axiosInstance.post("/auth/refresh");
  return response.data;
};