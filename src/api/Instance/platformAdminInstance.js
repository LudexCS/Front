// src/api/platformAdminInstance.js
import axios from "axios";

const platformAdminInstance = axios.create({
  baseURL: "http://3.37.46.45:30354/api",
});

export default platformAdminInstance;