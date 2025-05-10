import React from "react";
import { getPresignedUrl } from "../../api/uploadApi";
import "../../styles/upload/FileUploader.css";

const FileUploader = ({ maxFiles = 5, files = [], setFiles}) => {
  const handleAddFile = (e) => {
    const selected = Array.from(e.target.files)
      .filter((file) => file instanceof File)
      .map((file) => ({ file }));

  //   if (files.length + selected.length <= maxFiles) {
  //     setFiles([...files, ...selected]);
  //   } else {
  //     alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
  //   }

  //   // 선택 후 초기화
  //   e.target.value = null;
  // };

  const handleAddFile = async (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => file instanceof File);

    const newEntries = [];

    for (const file of selectedFiles) {
      try {
        const { uploadUrl, fileUrl } = await getPresignedUrl(file);

        await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        newEntries.push({ url: fileUrl, description: "" });
      } catch (err) {
        alert(`파일 업로드 실패: ${file.name}`);
        console.error(err);
      }
    }

    if (files.length + newEntries.length <= maxFiles) {
      setFiles([...files, ...newEntries]);
    } else {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
    }

    e.target.value = null;
  };

  const handleRemove = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <div className="file-uploader">
      <input type="file" multiple onChange={handleAddFile} />
      <ul>
        {files.map((entry, idx) => (
          <li key={idx}>
            <div>
              {entry.url.split("/").pop()}
              <button onClick={() => handleRemove(idx)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}};

export default FileUploader;