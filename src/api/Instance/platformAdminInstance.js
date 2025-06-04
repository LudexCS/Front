import axios from "axios";

const platformAdminInstance = axios.create({
  baseURL: "https://api.uosludex.com/platformadmin/api",
});

export default platformAdminInstance;