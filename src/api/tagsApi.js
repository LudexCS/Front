import axios from "axios";

export const getAllTags = async () => {
  try {
    const response = await axios.get("http://16.184.9.194:30354/api/get/tag");
    return response.data;
  } catch (error) {
    console.error("tag를 가져오는데 실패:", error);
    throw error;
  }
};

export const getBanner = async () => {
  try {
    const response = await axios.get("http://16.184.9.194:30354/api/get/banner");
    return response.data;
  } catch (error) {
    console.error("banner를 가져오는데 실패:", error);
    throw error;
  }
};