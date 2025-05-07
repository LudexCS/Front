// src/api/uploadApi.js
import gameManageInstance from "./Instance/gameManageInstance";

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

  // 🔹 JSON DTO를 Blob으로 변환해 formData에 첨부
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

  formData.append("json", jsonBlob); // 백엔드에서 @RequestPart("json")으로 받음

  // 🔹 썸네일 파일 첨부
  if (thumbnail?.file instanceof File) {
    formData.append("thumbnailUrl", thumbnail.file);
  }

  // 🔹 이미지/비디오 파일들 첨부
  mediaFiles.forEach(({ file }) => {
    if (file instanceof File) {
      formData.append("imageUrls", file);
    }
  });

  // ✅ 디버깅용 FormData 출력 (콘솔에서 확인)
  for (const [key, val] of formData.entries()) {
    console.log("FormData:", key, val);
  }

  // 🔹 업로드 요청
  try {
    const response = await gameManageInstance.post(
      "/protected/game/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // axios는 생략해도 자동 처리
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("게임 업로드 실패:", error);
    throw error;
  }
};