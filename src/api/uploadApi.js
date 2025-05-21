import gameManageInstance from "./Instance/gameManageInstance";
import uploadInstance from "./Instance/uploadFileInstance";

function sanitizeFilename(name) {
  return name.replace(/[^\w.-]+/g, "_"); // 한글, 공백, 특수문자 제거
}

function extractFile(input) {
  if (input instanceof File) return input;
  if (input?.file instanceof File) return input.file;
  throw new Error("File 형식으로 변환할 수 없습니다.");
}

export const uploadGameFile = async (gameId, gameFileInput) => {
  const gameFile = extractFile(gameFileInput);

  try {
    const response = await uploadInstance.post(
      `/protected/game/upload/${gameId}`,
      gameFile
    );
    console.log("uploadGameFile 됨");
    return response.data;
  } catch (err) {
    console.error("게임 파일 업로드 실패:", err);
    throw err;
  }
};

export const uploadResourceFile = async (resourceId, resourceFileInput) => {
  const resourceFile = extractFile(resourceFileInput);

  try {
    const response = await uploadInstance.post(
      `/protected/resource/upload/${resourceId}`,
      resourceFile
    );
    console.log("uploadResourceFile 됨");
    return response.data;
  } catch (err) {
    console.error("리소스 파일 업로드 실패:", err);
    throw err;
  }
};

export const uploadResourceData = async (resourceForm) => {
  // console.log("resourceForm: ", resourceForm);
  const {
    gameId,
    allowDerivation,
    sellerRatio,
    creatorRatio,
    additionalCondition,
    description,
    imageFiles,
  } = resourceForm;

  const formData = new FormData();

  const jsonData = {
    gameId,
    allowDerivation,
    sellerRatio,
    creatorRatio,
    additionalCondition,
    description,
  };

  console.log("jsonData: ", jsonData);

  formData.append("json", JSON.stringify(jsonData));

  // 이미지들 첨부
  imageFiles.forEach(({ file }) => {
    if (file instanceof File) {
      const safeFile = new File(
        [file],
        sanitizeFilename(file.name),
        { type: file.type }
      );
      formData.append("images", safeFile);
    }
  });

  // 디버깅 로그
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`[FormData] ${key}: ${value.name}, ${value.size} bytes`);
    } else {
      console.log(`[FormData] ${key}:`, value);
    }
  }

  try {
    const response = await gameManageInstance.post(
      "/protected/resource/create",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("리소스 업로드 실패:", error);
    throw error;
  }
};

export const uploadGameData = async ({
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
  };

  if (!isOrigin) {
    jsonData.originGameIds = originGameIds;
  }

  formData.append("json", JSON.stringify(jsonData));

  // 썸네일 파일 첨부
  if (thumbnail?.file instanceof File) {
    const safeThumb = new File(
      [thumbnail.file],
      sanitizeFilename(thumbnail.file.name),
      { type: thumbnail.file.type }
    );
    formData.append("thumbnail", safeThumb);
  }

  // 이미지들 첨부
  mediaFiles.forEach(({ file }) => {
    if (file instanceof File) {
      const safeFile = new File(
        [file],
        sanitizeFilename(file.name),
        { type: file.type }
      );
      formData.append("images", safeFile);
    }
  });

  // // 디버깅 로그
  // for (const [key, value] of formData.entries()) {
  //   if (value instanceof File) {
  //     console.log(`[FormData] ${key}: ${value.name}, ${value.size} bytes`);
  //   } else {
  //     console.log(`[FormData] ${key}:`, value);
  //   }
  // }

  try {
    const response = await gameManageInstance.post(
      "/protected/game/create",
      formData
    );
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error("게임 업로드 실패:", msg);
    throw error;
  }
};