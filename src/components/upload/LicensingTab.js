import React, { useState } from "react";
import FileUploader from "./FileUploader";
import LicensingHelpModal from "../modals/LicensingHelpModal";
import { useUpload } from "../../context/UploadContext";
import "../../styles/upload/LicensingTabs.css";

const TABS = [
  { key: "mode", label: "모드", defaultSplit: { seller: 30, buyer: 70 } },
  { key: "expansion", label: "확장판", defaultSplit: { seller: 20, buyer: 80 } },
  { key: "sequel", label: "후속작", defaultSplit: { seller: 10, buyer: 90 } },
];

const LicensingTab = () => {
  const [activeTab, setActiveTab] = useState("mode");
  const [showHelp, setShowHelp] = useState(false);
  const { resourceForm, setResourceForm } = useUpload();

  const handleCategoryChange = (key) => {
    const selected = TABS.find(tab => tab.key === key);
    setActiveTab(key);
    setResourceForm({
      ...resourceForm,
      sellerRatio: selected.defaultSplit.seller,
      creatorRatio: selected.defaultSplit.buyer,
    });
  };

  return (
    <div className="resource-licensing-tabs">
      <div className="resource-tab-body">
        <div className="resource-licensing-pane">
          <h4>리소스 업로드(압축파일 형태 업로드 권장)</h4>
          <FileUploader
            maxFiles={1}
            files={resourceForm.resourceFile ? [{ file: resourceForm.resourceFile }] : []}
            setFiles={(files) => setResourceForm({ ...resourceForm, resourceFile: files[0]?.file || null })}
          />

          <p>리소스 설명:</p>
          <textarea
            value={resourceForm.description}
            onChange={(e) =>
              setResourceForm({ ...resourceForm, description: e.target.value })
            }
          />

          <h4>리소스 미리보기 이미지 업로드</h4>
          <FileUploader
            files={resourceForm.imageFiles}
            setFiles={(files) => setResourceForm({ ...resourceForm, imageFiles: files })}
            maxFiles={5}
          />

          <div className="resource-tab-header">
            <h4>리소스 종류 선택</h4>
            <button className="resource-help-button" onClick={() => setShowHelp(true)}>?</button>
          </div>

          <div className="resource-radio-group">
            {TABS.map((tab) => (
              <label key={tab.key} style={{ marginRight: "1rem" }}>
                <input
                  type="radio"
                  name="resource-licensing-type"
                  value={tab.key}
                  checked={activeTab === tab.key}
                  onChange={() => handleCategoryChange(tab.key)}
                />
                {tab.label}
              </label>
            ))}
          </div>

          <h4>수익 배분 비율 설정</h4>
          <p>(ludex 10% 별도)</p>
          <div className="resource-revenue-split">
            {/* <p>플랫폼: 10%</p> */}
            <label>판매자 (%):</label>
            <input
              type="number"
              value={resourceForm.sellerRatio}
              onChange={(e) =>
                setResourceForm({
                  ...resourceForm,
                  sellerRatio: parseInt(e.target.value) || 0,
                  creatorRatio: 100 - (parseInt(e.target.value) || 0),
                })
              }
            />
            <label>구매자 (%):</label>
            <input type="number" value={resourceForm.creatorRatio} readOnly />
          </div>

          <h4>리소스 사용조건</h4>

          <label>
            <input
              type="checkbox"
              checked={resourceForm.allowDerivation}
              onChange={() =>
                setResourceForm({
                  ...resourceForm,
                  allowDerivation: !resourceForm.allowDerivation,
                })
              }
            />
            2차 파생 허용
          </label>

          <p style={{ display: "block" }}>추가 조건:</p>
          <textarea
            value={resourceForm.additionalCondition}
            onChange={(e) =>
              setResourceForm({ ...resourceForm, additionalCondition: e.target.value })
            }
          />

          {showHelp && <LicensingHelpModal onClose={() => setShowHelp(false)} />}
        </div>
      </div>
    </div>
  );
};

export default LicensingTab;