import axiosInstance from "./axiosInstance";

export const loginUser = async (id, password) => {
  const response = await axiosInstance.post("/auth/login", { id, password });
  return response.data;
};

export const getNewAccessToken = async () => {
  const response = await axiosInstance.get("/auth/reissue");

  // 헤더에서 access token 추출
  const authHeader = response.headers["authorization"];
  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) throw new Error("access token 재발급 실패");

  return { accessToken };
};