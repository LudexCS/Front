import platformAdminInstance from "./Instance/platformAdminInstance";

export const getAllTags = async () => {
  try {
    const response = await platformAdminInstance.get("/get/tag");
    // console.log("tags response: ", response);
    return response.data;
  } catch (error) {
    console.error("tag를 가져오는데 실패:", error);
    throw error;
  }
};

export const getBanner = async () => {
  try {
    const response = await platformAdminInstance.get("/get/banner");
    // console.log("tags response: ", response);
    return response.data;
  } catch (error) {
    console.error("banner를 가져오는데 실패:", error);
    throw error;
  }
};