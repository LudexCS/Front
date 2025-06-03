// src/api/platformAdminInstance.js
import axios from "axios";

const platformAdminInstance = axios.create({
  baseURL: "http://api.uosludex.com/platformadmin/api",
});

export default platformAdminInstance;