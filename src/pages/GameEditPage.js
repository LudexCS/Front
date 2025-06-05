import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarSearch from "../components/layout/NavbarSearch";
import { useUpload } from "../context/UploadContext";
import TagSelector from "../components/upload/TagSelector";
import LicensingTab from "../components/upload/LicensingTab";
import FileUploader from "../components/upload/FileUploader";
import IPSelectorModal from "../components/upload/IPSelectorModal";
import LoadingModal from "../components/modals/LoadingModal";
import { fetchGameDetail, fetchGameResource } from "../api/gameGetApi";
import { getAllTags } from "../api/tagsApi";
import { updateGameData, updateResourceData } from "../api/uploadApi";

const GameEditPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { gameForm, setGameForm, resourceForm, setResourceForm, sharerIds } = useUpload();
  const [selectedTags, setSelectedTags] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [selectedIPs, setSelectedIPs] = useState([]);
  const [specFields, setSpecFields] = useState({
    os: false, cpu: false, gpu: false, ram: false, storage: false, network: false,
  });
  const [specValues, setSpecValues] = useState({
    os: "", cpu: "", gpu: "", ram: "", storage: "", network: "",
  });
  const resetUploadForm = () => {
    setGameForm({
      title: "",
      price: "",
      description: "",
      tags: [],
      requirements: [],
      originGameIds: [],
      gameFile: null,
      thumbnail: null,
      mediaFiles: [],
    });
    setSelectedTags([]);
    setResourceForm({
      gameId: 0,
      allowDerivation: true,
      sellerRatio: 30,
      creatorRatio: 70,
      additionalCondition: "",
      description: "",
      imageFiles: [],
      resourceFile: null,
    });
    setSpecFields({
      os: true,
      cpu: false,
      gpu: false,
      ram: false,
      storage: false,
      network: false,
    });
    setSpecValues({
      os: "",
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      network: "",
    });
  };

  useEffect(() => {
    resetUploadForm();
  }, []);

  useEffect(() => {
    (async () => {
      setIsUploading(true);
      try {
        const [gameData, allTags] = await Promise.all([
          fetchGameDetail({ gameId }),
          getAllTags(),
        ]);

        const tagNameToId = Object.fromEntries(allTags.map((tag) => [tag.name, tag.id]));
        const tagIds = gameData.tags.map((name) => tagNameToId[name]).filter(Boolean);

        setSelectedTags(tagIds);
        
        setGameForm({
          ...gameData,
          isOrigin: true,
        });

        const fields = { ...specFields };
        const values = { ...specValues };
        Object.entries(gameData.requirements?.[0] || {}).forEach(([key, value]) => {
          if (fields.hasOwnProperty(key)) {
            fields[key] = true;
            values[key] = value;
          }
        });
        setSpecFields(fields);
        setSpecValues(values);

      } catch (err) {
        console.error("게임 상세 정보를 불러오는 데 실패했습니다", err);
        navigate("/");
      }

      try {
        const resourceData = await fetchGameResource({ gameId });
        setResourceForm(resourceData);
      } catch (err) {
        console.error("게임 리소스 정보를 불러오는 데 실패했습니다", err);
        navigate("/");
      }
      setIsUploading(false);
    })();
  }, [gameId]);

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      alert("태그를 하나 이상 선택해주세요.");
      return;
    }
    if (!Array.isArray(gameForm.mediaFiles) || gameForm.mediaFiles.length === 0 || !gameForm.thumbnail ||
    (resourceForm.resourceFile != null && (!Array.isArray(resourceForm.imageFiles) || resourceForm.imageFiles.length === 0))) {
      alert("이미지 파일을 하나 이상 업로드해주세요.");
      return;
    }
    if (!gameForm.isOrigin && sharerIds.length === 0) {
      alert("게임 IP를 하나 이상 선택해주세요.");
      return;
    }

    alert("수정사항을 반영합니다. 완료 될 때까지 잠시 기다려주세요.");
    setIsUploading(true);

    const filteredRequirements = {
      ...Object.fromEntries(
        Object.entries(specFields)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => [key, specValues[key]])
      ),
    };

    const updatedGameForm = {
      ...gameForm,
      requirements: [filteredRequirements],
      tags: selectedTags.map((tagId) => ({ tagId, priority: 10 })),
    };

    console.log("수정된 게임 데이터:", updatedGameForm);
    console.log("수정된 리소스 데이터:", resourceForm);
    
    try{
      await updateGameData(updatedGameForm);
      if (resourceForm.resourceFile != null) {
        await updateResourceData(resourceForm);
      }
      alert("게임 수정에 성공했습니다.");
    } catch (err) {
      console.error(err);
      alert("게임 수정에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSpecField = (key) => {
    setSpecFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <NavbarSearch />
      {isUploading && <LoadingModal />}
      <div className="upload-page">
        <h1 className="edit-page-title">게임 수정</h1>

        <h2>게임 파일 업로드</h2>
        <FileUploader
          maxFiles={1}
          files={gameForm.gameFile ? [{ file: gameForm.gameFile }] : []}
          setFiles={(files) =>
            setGameForm({ ...gameForm, gameFile: files[0]?.file || null })
          }
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
          <label>게임명(영문):</label>
          <input
            type="text"
            value={gameForm.title}
            onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
          />
          
          <label>게임명(한글):</label>
          <input
            type="text"
            value={gameForm.titleKo}
            onChange={(e) => setGameForm({ ...gameForm, titleKo: e.target.value })}
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

        <label>분류: {gameForm.isOrigin ? "Origin" : "Variant"}</label>

        {!gameForm.isOrigin && (
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

        {(gameForm.isOrigin || (selectedIPs.every(ip => ip.includes("2차 제작 허용")) && selectedIPs.length > 0)) && (
          <LicensingTab />
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