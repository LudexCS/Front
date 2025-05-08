import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSearch from "../components/layout/NavbarSearch";
import FileUploader from "../components/upload/FileUploader";
import TagSelector from "../components/upload/TagSelector";
import CategorySelector from "../components/upload/CategorySelector";
import LicensingTabs from "../components/upload/LicensingTabs";
import LicensingHelpModal from "../components/modals/LicensingHelpModal";
import IPSelectorModal from "../components/upload/IPSelectorModal";
import TermsAgreementModal from "../components/modals/TermsAgreementModal";
import { useUpload } from "../context/UploadContext";
// import { useUser } from "../context/UserContext";
import { uploadGame } from "../api/uploadApi";
import "../styles/pages/GameUploadPage.css";

const GameUploadPage = () => {
  const navigate = useNavigate();
  // const { user } = useUser();
  const { gameForm, setGameForm } = useUpload();
  const [category, setCategory] = useState("origin");
  const [showHelp, setShowHelp] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [selectedIPs, setSelectedIPs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [licensingFiles, setLicensingFiles] = useState({
    mode: [],
    expansion: [],
    sequel: []
  });
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [specFields, setSpecFields] = useState({
    os: true,
    cpu: false,
    gpu: false,
    ram: false,
    storage: false,
    network: false,
  });
  const [specValues, setSpecValues] = useState({
    os: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    network: "",
  });

  const toggleSpecField = (key) => {
    setSpecFields({ ...specFields, [key]: !specFields[key] });
  };

  const handleSubmit = async () => {
    if (!agreed) {
      alert("약관에 동의해야 합니다.");
      return;
    }
    if (selectedTags.length === 0) {
      alert("태그를 하나 이상 선택해주세요.");
      return;
    }

    const requirements = [
      {
        ...Object.fromEntries(
          Object.entries(specFields)
            .filter(([key, enabled]) => enabled)
            .map(([key]) => [key, specValues[key]])
        ),
      },
    ];

    const payload = {
      ...gameForm,
      price: parseFloat(gameForm.price),
      isOrigin: category === "origin",
      originGameIds: selectedIPs.map(ip => {
          const match = ip.match(/\d+/);
          return match ? parseInt(match[0], 10) : null;
        }).filter(id => id !== null),
      tags: selectedTags.map((tagId) => ({tagId, priority: 10})),
      requirements,
      thumbnail: gameForm.thumbnail,
      mediaFiles: gameForm.mediaFiles,
    };
    
    console.log("payload: ", payload);
    
    try {
      await uploadGame(payload);
      alert("게임이 등록되었습니다.");
      //payload reset
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("게임 등록에 실패했습니다.");
    }
  };

  return (
    <div>
      <NavbarSearch />
      <div className="upload-page">
        <h2>썸네일 이미지 업로드</h2>
        <FileUploader
          maxFiles={1}
          files={gameForm.thumbnail ? [gameForm.thumbnail] : []}
          setFiles={(f) => setGameForm({ ...gameForm, thumbnail: f[0] })}
          showDescriptionInput={false}
        />

        <h2>이미지&영상 파일 업로드</h2>
        <FileUploader
          maxFiles={5}
          files={gameForm.mediaFiles}
          setFiles={(files) => setGameForm({ ...gameForm, mediaFiles: files })}
          showDescriptionInput={false}
        />

        <div className="form-section">
          <label>게임명:</label>
          <input
            type="text"
            value={gameForm.title}
            onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
          />

          <label>가격:</label>
          <input
            type="text"
            value={gameForm.price}
            onChange={(e) => setGameForm({ ...gameForm, price: e.target.value })}
          />

          <label>게임설명:</label>
          <textarea
            value={gameForm.description}
            onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
          />

          <label>구동사양 (하나 이상 선택):</label>
          <div className="spec-checkboxes">
            {Object.keys(specFields).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={specFields[key]}
                  onChange={() => toggleSpecField(key)}
                />
                {key.toUpperCase()}
              </label>
            ))}
          </div>

          {Object.entries(specFields).map(
            ([key, enabled]) =>
              enabled && (
                <div key={key}>
                  <label>{key.toUpperCase()}:</label>
                  <input
                    type="text"
                    value={specValues[key]}
                    onChange={(e) => setSpecValues({ ...specValues, [key]: e.target.value })}
                  />
                </div>
              )
          )}
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

        {(category === "origin" || (selectedIPs.every(ip => ip.includes("2차 허용")) && selectedIPs.length > 0)) && (
          <LicensingTabs licensingFiles={licensingFiles} setLicensingFiles={setLicensingFiles} />
        )}

        <div className="agreement-section">
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            약관에 동의합니다.
          </label>
          <button onClick={() => setShowTerms(true)}>약관 보기</button>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>

        {showTerms && <TermsAgreementModal onClose={() => setShowTerms(false)} />}
        {showHelp && <LicensingHelpModal onClose={() => setShowHelp(false)} />}
        {showIPModal && <IPSelectorModal onClose={() => setShowIPModal(false)} setSelectedIPs={setSelectedIPs} />}
      </div>
    </div>
  );
};

export default GameUploadPage;