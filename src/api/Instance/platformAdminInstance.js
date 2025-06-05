import axios from "axios";

const platformAdminInstance = axios.create({
  baseURL: "https://api.uosludex.com/platformadmin/api",
});

platformAdminInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default platformAdminInstance;