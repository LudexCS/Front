import axios from "axios";

export const getAllTags = async () => {
  try {
    const response = await axios.get("https://api.uosludex.com/platformadmin/api/get/tag");
    return response.data;
  } catch (error) {
    console.error("tag를 가져오는데 실패:", error);
    throw error;
  }
};

export const getBanner = async () => {
  try {
    const response = await axios.get("https://api.uosludex.com/platformadmin/api/get/banner");
    return response.data;
  } catch (error) {
    console.error("banner를 가져오는데 실패:", error);
    throw error;
  }
};