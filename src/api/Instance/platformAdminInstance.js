import axios from "axios";

const platformAdminInstance = axios.create({
  baseURL: "http://16.184.9.194:30354/api",
  withCredentials: true,
});

// 요청 시 access token 자동 첨부
platformAdminInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default platformAdminInstance;