import gameManageInstance from "./Instance/gameManageInstance";

export const uploadGame = async ({
  title,
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
    price,
    description,
    requirements,
    tags,
    isOrigin,
    originGameIds,
  };

  const jsonBlob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });

  formData.append("json", jsonBlob);

  if (thumbnail?.file instanceof File) {
    formData.append("thumbnailUrl", thumbnail.file);
  }

  mediaFiles.forEach(({ file }) => {
    if (file instanceof File) {
      formData.append("imageUrls", file);
    }
  });

  for (const [key, val] of formData.entries()) {
    console.log("FormData:", key, val);
  }

  try {
    const response = await gameManageInstance.post(
      "/protected/game/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("게임 업로드 실패:", error);
    throw error;
  }
};