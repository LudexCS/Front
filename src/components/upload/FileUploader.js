import React from "react";
import "../../styles/FileUploader.css";

const FileUploader = ({ maxFiles = 5, files = [], setFiles }) => {
  const handleAddFile = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length <= maxFiles) {
      setFiles([...files, ...selected]);
    } else {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
    }
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
        {files.map((file, idx) => (
          <li key={idx}>
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
            <button onClick={() => handleRemove(idx)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;