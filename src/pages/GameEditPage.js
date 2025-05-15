// src/pages/GameEditPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarSearch from "../components/layout/NavbarSearch";
import { useUpload } from "../context/UploadContext";
import TagSelector from "../components/upload/TagSelector";
import LicensingTab from "../components/upload/LicensingTab";
import FileUploader from "../components/upload/FileUploader";
import IPSelectorModal from "../components/upload/IPSelectorModal";
// import "../styles/pages/GameEditPage.css";

const mockGame = {
  title: "Space Blaster",
  price: 50,
  description: "An arcade-style space shooter game.",
  requirements: [
    {
      os: "Windows 11",
      cpu: "Intel i7",
      gpu: "NVIDIA RTX 2060",
      ram: "16GB",
      storage: "5GB",
      network: "Broadband Internet",
    },
  ],
  tags: [
    { tagId: 1, priority: 10 },
    { tagId: 23, priority: 5 },
  ],
  isOrigin: true,
  thumbnailUrl: "https://example.com/thumbnails/space-blaster.jpg",
  imageUrls: [
    "https://example.com/images/screenshot1.jpg",
    "https://example.com/images/screenshot2.jpg",
  ],
  originGameIds: []
};

const mockResource = {
  gameId: 1,
  allowDerivation: true,
  sellerRatio: 30,
  creatorRatio: 70,
  additionalCondition: "You must credit the original creator.",
  description: "High-resolution character sprites for use in RPGs.",
  imageUrls: [
    "https://example.com/images/screenshot1.jpg",
    "https://example.com/images/screenshot2.jpg",
  ],
};

const GameEditPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { gameForm, setGameForm, resourceForm, setResourceForm } = useUpload();
  const [selectedTags, setSelectedTags] = useState([]);
  const [showIPModal, setShowIPModal] = useState(false);
  const [selectedIPs, setSelectedIPs] = useState(mockGame.originGameIds);
  const [specFields, setSpecFields] = useState({
    os: false, cpu: false, gpu: false, ram: false, storage: false, network: false,
    });
    const [specValues, setSpecValues] = useState({
    os: "", cpu: "", gpu: "", ram: "", storage: "", network: "",
    });

  useEffect(() => {
    // 실제 API 호출 예시 (현재는 주석 처리)
    // const gameData = await fetchGameById(gameId);
    // setGameForm(gameData);
    // setResourceForm(resourceData);

    setGameForm({
      title: mockGame.title,
      price: mockGame.price,
      description: mockGame.description,
      requirements: mockGame.requirements,
      gameFile: mockGame.thumbnailUrl,
      thumbnail: mockGame.thumbnailUrl,
      mediaFiles: mockGame.imageUrls,
      tags: mockGame.tags,
      originGameIds: [],
    });

    setResourceForm({
      ...mockResource,
      resourceFile: mockGame.thumbnailUrl,
      imageFiles: mockResource.imageUrls,
    });

    setSelectedTags(mockGame.tags.map((t) => t.tagId));

    const fields = { ...specFields };
    const values = { ...specValues };
    Object.entries(mockGame.requirements[0]).forEach(([key, value]) => {
        if (fields.hasOwnProperty(key)) {
        fields[key] = true;
        values[key] = value;
        }
    });
    setSpecFields(fields);
    setSpecValues(values);
  }, [gameId]);

    const handleSubmit = () => {
    if (selectedTags.length === 0) {
      alert("태그를 하나 이상 선택해주세요.");
      return;
    }
    if (!mockGame.isOrigin && selectedIPs.length === 0) {
      alert("게임 IP를 하나 이상 선택해주세요.");
      return;
    }
    const filteredRequirements = {
        isMinimum: false,
        ...Object.fromEntries(
        Object.entries(specFields)
            .filter(([_, enabled]) => enabled)
            .map(([key]) => [key, specValues[key]])
        )
    };

    const updatedGameForm = {
        ...gameForm,
        requirements: [filteredRequirements],
        tags: selectedTags.map((tagId) => ({ tagId, priority: 10 }))
    };

    console.log("수정된 게임 데이터:", updatedGameForm);
    console.log("수정된 리소스 데이터:", resourceForm);
    alert("콘솔에서 수정 내용을 확인하세요.");
    };

    const toggleSpecField = (key) => {
    setSpecFields((prev) => ({ ...prev, [key]: !prev[key] }));
    };

  return (
    <>
      <NavbarSearch />
      <div className="upload-page">
        <h1 className="edit-page-title">게임 수정</h1>

        <h2>게임 파일 업로드(압축파일 형태 업로드 권장)</h2>
        <FileUploader
          maxFiles={1}
          files={gameForm.gameFile ? [{ file: gameForm.gameFile }] : []}
          setFiles={(files) => setGameForm({ ...gameForm, gameFile: files[0]?.file || null })}
        />

        <h2>썸네일 업로드</h2>
        <FileUploader
          maxFiles={1}
          files={gameForm.thumbnail ? [gameForm.thumbnail] : []}
          setFiles={(f) => setGameForm({ ...gameForm, thumbnail: f[0] })}
        />

        <h2>추가 이미지 업로드</h2>
        <FileUploader
          maxFiles={5}
          files={gameForm.mediaFiles}
          setFiles={(files) => setGameForm({ ...gameForm, mediaFiles: files })}
        />

        <div className="form-section">
          <label>게임명:</label>
          <input
            type="text"
            value={gameForm.title}
            onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
          />

          <label>가격(USD):</label>
          <input
            type="number"
            value={gameForm.price}
            onChange={(e) => setGameForm({ ...gameForm, price: parseFloat(e.target.value) })}
          />

          <label>게임 설명:</label>
          <textarea
            value={gameForm.description}
            onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
          />

          <label>권장 구동사양 (하나 이상 선택):</label>
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
                        onChange={(e) =>
                        setSpecValues((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                    />
                    </div>
                )
            )}
        </div>

        <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

        <label>분류: {mockGame.isOrigin ? "Origin" : "Variant"}</label>

        {!mockGame.isOrigin && (
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

        {(mockGame.isOrigin || (selectedIPs.every(ip => ip.includes("2차 제작 허용")) && selectedIPs.length > 0)) && (
          <LicensingTab/>
        )}

        <div className="action-buttons">
          <button onClick={() => {
              navigate(-1);
              navigate("/");
              }}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>

        {showIPModal && <IPSelectorModal onClose={() => setShowIPModal(false)} setSelectedIPs={setSelectedIPs} />}
      </div>
    </>
  );
};

export default GameEditPage;