import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import FileUploader from "../components/upload/FileUploader";
import TagSelector from "../components/upload/TagSelector";
import CategorySelector from "../components/upload/CategorySelector";
import LicensingTabs from "../components/upload/LicensingTabs";
import LicensingHelpModal from "../components/upload/LicensingHelpModal";
import IPSelectorModal from "../components/upload/IPSelectorModal";
import "../styles/pages/GameUploadPage.css";

const GameUploadPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("origin");
  const [showHelp, setShowHelp] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [selectedIPs, setSelectedIPs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [licensingFiles, setLicensingFiles] = useState({
    mode: [],
    expansion: [],
    sequel: []
  });

  const handleSubmit = () => {
    if (selectedTags.length === 0) {
      alert("태그를 하나 이상 선택해주세요.");
      return;
    }
  
    console.log("=== 미디어 파일 목록 ===");
    mediaFiles.forEach((f) => console.log(`- ${f.name}`));
  
    console.log("\n=== 각 용도별 리소스 업로드 파일 목록 (직접 업로드한 것만) ===");
    Object.entries(licensingFiles).forEach(([key, files]) => {
      console.log(`[${key}]`);
      files.forEach((f) => console.log(`- ${f.name}`));
    });
  
    // 리소스 상속 적용
    const inherited = {
      mode: [...licensingFiles.mode],
      expansion: [...licensingFiles.mode, ...licensingFiles.expansion],
      sequel: [
        ...licensingFiles.mode,
        ...licensingFiles.expansion,
        ...licensingFiles.sequel,
      ],
    };
  
    console.log("\n=== 리소스 상속 반영 후 최종 포함 파일 목록 ===");
    Object.entries(inherited).forEach(([key, files]) => {
      console.log(`[${key}]`);
      const uniqueFiles = Array.from(new Set(files.map((f) => f.name)));
      uniqueFiles.forEach((name) => console.log(`- ${name}`));
    });
  
    alert("게임이 등록되었습니다.");
  };
  

  return (
    <div>
      <Navbar />
      <div className="upload-page">
        <h2>이미지&영상 파일 업로드</h2>
        <FileUploader maxFiles={5} files={mediaFiles} setFiles={setMediaFiles} />

        <div className="form-section">
          <label>게임명:</label>
          <input type="text" />
          <label>가격:</label>
          <input type="text" />
          <label>게임설명:</label>
          <textarea />
          <label>구동사양:</label>
          <input type="text" />
        </div>

        <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

        <CategorySelector category={category} setCategory={setCategory} />

        {category === "variant" && (
          <div className="ip-input-section">
            <label>사용 게임 IP:</label>
            <button className="ip-check-button" onClick={() => setShowIPModal(true)}>
              라이선스를 사용한 게임 IP 선택 ➤
            </button>
            {selectedIPs.length > 0 && (
              <ul className="selected-ip-list">
                {selectedIPs.map((ip, idx) => (
                  <li key={idx}>{ip}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(category === "origin" || (selectedIPs.length > 0 && selectedIPs.every(ip => ip.includes("2차 허용"))) ) && (
          <LicensingTabs
            licensingFiles={licensingFiles}
            setLicensingFiles={setLicensingFiles}
          />
        )}

        <div className="action-buttons">
          <button onClick={()=>navigate(-1)}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>

        {showHelp && <LicensingHelpModal onClose={() => setShowHelp(false)} />}
        {showIPModal && <IPSelectorModal onClose={() => setShowIPModal(false)} setSelectedIPs={setSelectedIPs} />}
      </div>
    </div>
  );
};

export default GameUploadPage;