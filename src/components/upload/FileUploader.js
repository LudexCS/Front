import React from "react";
import "../../styles/upload/FileUploader.css";

const FileUploader = ({ maxFiles = 5, files = [], setFiles }) => {
  const handleAddFile = (e) => {
    const selected = Array.from(e.target.files)
      .filter((file) => file instanceof File)
      .map((file) => ({ file }));

    if (files.length + selected.length <= maxFiles) {
      setFiles([...files, ...selected]);
    } else {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
    }

    // 선택 후 초기화
    e.target.value = null;
  };

  const handleRemove = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleDescriptionChange = (index, desc) => {
    const updated = [...files];
    updated[index].description = desc;
    setFiles(updated);
  };

  return (
    <div className="file-uploader">
      <input type="file" multiple onChange={handleAddFile} />
      <ul>
        {files.map((entry, idx) => (
          <li key={idx}>
            <div>
              {entry.file? entry.file.name : "파일"} ({((entry.file? entry.file.size : 1024) / 1024).toFixed(1)} KB)
              <button onClick={() => handleRemove(idx)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;