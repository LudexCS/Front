import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSearch from "../components/layout/NavbarSearch";
import FileUploader from "../components/upload/FileUploader";
import TagSelector from "../components/upload/TagSelector";
import CategorySelector from "../components/upload/CategorySelector";
import LicensingTab from "../components/upload/LicensingTab";
import LicensingHelpModal from "../components/modals/LicensingHelpModal";
import IPSelectorModal from "../components/upload/IPSelectorModal";
import TermsAgreementModal from "../components/modals/TermsAgreementModal";
import { useUpload } from "../context/UploadContext";
import { useRecord } from "../context/RecordContext";
import { useUser } from "../context/UserContext";
import { useConfig } from "../context/ConfigContext";
import { useGameContext } from "../context/gameContext";
import { registerGame } from "../api/walletAuth";
import { uploadGameData, uploadResourceData, uploadGameFile, uploadResourceFile } from "../api/uploadApi";
import LoadingModal from "../components/modals/LoadingModal";
import "../styles/pages/GameUploadPage.css";
import * as ludex from "ludex";

const GameUploadPage = () => {
  const navigate = useNavigate();
  const { gameForm, setGameForm, resourceForm, setResourceForm, sharerIds, setSharerIds } = useUpload();
  const { setIsFetch } = useRecord();
  const { setIsUpload } = useGameContext();
  const { user, isLoggedIn } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const { chainConfig } = useConfig();
  const [category, setCategory] = useState("origin");
  const [showHelp, setShowHelp] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [selectedIPs, setSelectedIPs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
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

  const resetUploadForm = () => {
    setGameForm({
      title: "",
      titleKo: "",
      price: "",
      description: "",
      tags: [],
      requirements: [],
      originGameIds: [],
      gameFile: null,
      thumbnail: null,
      mediaFiles: [],
    });

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

    setSelectedTags([]);
    setSelectedIPs([]);
    setAgreed(false);
    setCategory("origin");
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

  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
  };

  useEffect(() => {
    setIsFetch(false);
    setIsUpload(false);
    resetUploadForm();
  }, []);
  
  useEffect(() => {
      if (!isLoggedIn) {
        navigate("/login");
    } else if (!isMetaMaskInstalled()) {
      alert("MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.");
      navigate("/");
      }
    }, [isLoggedIn, navigate]);

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
    if (!Array.isArray(gameForm.mediaFiles) || gameForm.mediaFiles.length === 0 || !gameForm.thumbnail ||
    (resourceForm.resourceFile !== null && (!Array.isArray(resourceForm.imageFiles) || resourceForm.imageFiles.length === 0))) {
      alert("이미지 파일을 하나 이상 업로드해주세요.");
      return;
    }
    if (category === "variant" && sharerIds.length === 0) {
      alert("게임 IP를 하나 이상 선택해주세요.");
      return;
    }

    alert("등록을 시도합니다. 완료 될 때까지 잠시 기다려주세요.");
    setIsUploading(true);

    const chainIdHex = chainConfig.chainId.toLowerCase();

    try {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

      if (currentChainId !== chainIdHex) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }]
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // 체인 추가 시도
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [chainConfig]
              });
            } catch (addError) {
              console.warn("Add chain failed:", addError);
              const nowChainId = await window.ethereum.request({ method: "eth_chainId" });
              if (nowChainId.toLowerCase() !== chainIdHex) {
                alert("이더리움 네트워크 전환에 실패했습니다.");
                setIsUploading(false);
                return;
              }
            }
          } else {
            throw switchError;
          }
        }
      }
    } catch (err) {
      console.error("MetaMask 네트워크 연결 실패:", err);
    }

    const wallet = await ludex.BrowserWalletConnection.create(chainConfig);
    const sellerAddress = (await wallet.getCurrentAddress()).stringValue;

    // sellerAddress가 user.cryptoWallet 배열에 없다면 알림.
    if (!user.cryptoWallet.some(wallet => wallet.address?.toLowerCase() === sellerAddress.toLowerCase())) {
      alert(`해당 메타마스크 지갑 주소(${sellerAddress})는 등록된 판매자 지갑이 아닙니다. 주소를 등록해주세요.`);
      setIsUploading(false);
      navigate("/my");
      return;
    }

    if(category === "origin"){
      setGameForm({ ...gameForm, originGameIds:[]})
      setSharerIds([]);
    };

    const requirements = [
      {
        isMinimum: false, 
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
      tags: selectedTags.map((tagId) => ({tagId, priority: 10})),
      requirements: requirements,
      thumbnail: gameForm.thumbnail,
      mediaFiles: gameForm.mediaFiles,
    };
    console.log("payload: ", payload);
        
    try {
      const responseGame = await uploadGameData(payload);
      console.log("const responseGame = await uploadGameData(payload);");

      await uploadGameFile(responseGame.gameId, gameForm.gameFile);
      console.log("await uploadGameFile(responseGame.gameId, gameForm.gameFile);");

      if (resourceForm.resourceFile !== null) {
        const responseResource = await uploadResourceData({
          ...resourceForm,
          gameId: responseGame.gameId
        });
        console.log("const responseResource = await uploadResourceData({");
        
        await uploadResourceFile(responseResource.resourceId, resourceForm.resourceFile);
      }
      const item = {
        gameId: responseGame.gameId,
        itemName: gameForm.title,
        seller: sellerAddress,
        sharers: sharerIds,
        itemPrice: gameForm.price,
        shareTerms: [resourceForm.sellerRatio*100]
      };
      await registerGame(item);

      setIsFetch(true);
      setIsUpload(true);
      alert("게임이 등록되었습니다.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("게임 등록에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <NavbarSearch />
      {isUploading && <LoadingModal />}
      <div className="upload-page">
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
            type="text"
            value={gameForm.price}
            onChange={(e) => setGameForm({ ...gameForm, price: e.target.value })}
          />

          <label>게임설명:</label>
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

        {(category === "origin" || (selectedIPs.every(ip => ip.includes("2차 제작 허용")) && selectedIPs.length > 0)) && (
          <LicensingTab/>
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
          <button onClick={() => {
              navigate(-1);
              navigate("/");
              }}>Back</button>
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