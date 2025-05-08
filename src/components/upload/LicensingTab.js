import React, { useState } from "react";
import FileUploader from "./FileUploader";
import LicensingHelpModal from "../modals/LicensingHelpModal";
import "../../styles/upload/LicensingTabs.css";

const TABS = [
  { key: "mode", label: "모드", defaultSplit: { seller: 30, buyer: 60 } },
  { key: "expansion", label: "확장판", defaultSplit: { seller: 20, buyer: 70 } },
  { key: "sequel", label: "후속작", defaultSplit: { seller: 10, buyer: 80 } },
];

const LicensingTab = ({ licensingFiles, setLicensingFiles }) => {
  const [activeTab, setActiveTab] = useState("mode");
  const [showHelp, setShowHelp] = useState(false);

  const uploadedFiles = licensingFiles[activeTab];

  const [sellerShare, setSellerShare] = useState(30);
  const [buyerShare, setBuyerShare] = useState(60);
  const [description, setDescription] = useState("");
  const [extra, setExtra] = useState("");
  const [allowDerivative, setAllowDerivative] = useState(false);

  const handleFilesChange = (files) => {
    setLicensingFiles((prev) => ({
      ...prev,
      [activeTab]: files,
    }));
  };

  const handleSellerShareChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setSellerShare(value);
    setBuyerShare(90 - value);
  };

  const handleCategoryChange = (key) => {
    const selected = TABS.find(tab => tab.key === key);
    setActiveTab(key);
    setSellerShare(selected.defaultSplit.seller);
    setBuyerShare(selected.defaultSplit.buyer);
  };

  return (
    <div className="licensing-tabs">
      <div className="tab-body">
        <div className="licensing-pane">
          <h4>리소스 업로드(압축파일형태로 업로드 권장)</h4>
          <FileUploader
            files={uploadedFiles}
            setFiles={handleFilesChange}
            maxFiles={1}
          />

          <label>리소스 설명:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="tab-header">
          <h4>리소스 종류 선택</h4>
            <button className="help-button" onClick={() => setShowHelp(true)}>
            ?
            </button>
          </div>
          <div className="radio-group">
            {TABS.map((tab) => (
              <label key={tab.key} style={{ marginRight: "1rem" }}>
                <input
                  type="radio"
                  name="licensing-type"
                  value={tab.key}
                  checked={activeTab === tab.key}
                  onChange={() => handleCategoryChange(tab.key)}
                />
                {tab.label}
              </label>
            ))}
          </div>

          <h4>수익 배분 비율 설정</h4>
          <div className="revenue-split">
            <p>플랫폼: 10%</p>
            <label>판매자 (%):</label>
            <input
              type="number"
              value={sellerShare}
              onChange={handleSellerShareChange}
            />
            <label>구매자 (%):</label>
            <input type="number" value={buyerShare} readOnly />
          </div>

          <label>
            <input
              type="checkbox"
              checked={allowDerivative}
              onChange={() => setAllowDerivative(!allowDerivative)}
            />
            2차 파생 허용
          </label>

          <label>추가 조건:</label>
          <textarea value={extra} onChange={(e) => setExtra(e.target.value)} />

          {showHelp && <LicensingHelpModal onClose={() => setShowHelp(false)} />}
        </div>
      </div>
    </div>
  );
};

export default LicensingTab;