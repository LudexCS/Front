// src/api/platformAdminInstance.js
import axios from "axios";

const platformAdminInstance = axios.create({
  baseURL: "http://16.184.9.194:30354/api",
});

export default platformAdminInstance;