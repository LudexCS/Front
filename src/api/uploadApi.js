import gameManageInstance from "./Instance/gameManageInstance";
import axios from "axios";

// S3 presigned URL 발급 ?
export const getPresignedUrl = async (file) => {
  const res = await axios.post("/api/upload/presign", {
    fileName: file.name,
    fileType: file.type,
  });
  return res.data; // { uploadUrl, fileUrl }
};

// 게임 업로드
export const uploadGame = async ({
  title,
  userId,
  price,
  description,
  requirements,
  tags,
  isOrigin,
  originGameIds = [],
  thumbnail,
  mediaFiles = [],
}) => {
  const formData = new FormData();

  const jsonData = {
    title,
    userId,
    price: parseFloat(price),
    description,
    requirements,
    tags,
    isOrigin,
    originGameIds: isOrigin ? [] : originGameIds,
  };

  const jsonBlob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  formData.append("json", jsonBlob);

  if (thumbnail?.url) {
    formData.append("thumbnailUrl", thumbnail.url);
  }

  mediaFiles.forEach(({ url }) => {
    if (url) formData.append("imageUrls", url);
  });

  try {
    const response = await gameManageInstance.post(
      "/protected/game/create",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("게임 업로드 실패:", error);
    throw error;
  }
};