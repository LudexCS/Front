import React, { useState } from "react";
import LicensingTabPane from "./LicensingTabPane";
import LicensingHelpModal from "../modals/LicensingHelpModal";
import "../../styles/upload/LicensingTabs.css";

const TABS = [
  { key: "mode", label: "모드", defaultSplit: { seller: 30, buyer: 60 } },
  { key: "expansion", label: "확장판", defaultSplit: { seller: 20, buyer: 70 } },
  { key: "sequel", label: "후속작", defaultSplit: { seller: 10, buyer: 80 } },
];

const LicensingTabs = ({ licensingFiles, setLicensingFiles }) => {
  const [activeTab, setActiveTab] = useState("mode");
  const [showHelp, setShowHelp] = useState(false);

  const getInheritedFiles = (key) => {
    if (key === "mode") return licensingFiles.mode;
    if (key === "expansion") return [...licensingFiles.mode, ...licensingFiles.expansion];
    if (key === "sequel") return [
      ...licensingFiles.mode,
      ...licensingFiles.expansion,
      ...licensingFiles.sequel
    ];
    return [];
  };

  const handleFilesChange = (key, files) => {
    setLicensingFiles((prev) => ({
      ...prev,
      [key]: files,
    }));
  };

  return (
    <div className="licensing-tabs">
      <div className="tab-header">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button className="help-button" onClick={() => setShowHelp(true)}>?</button>
      </div>

      <div className="tab-body">
        {TABS.map((tab) =>
          activeTab === tab.key ? (
            <LicensingTabPane
              key={tab.key}
              type={tab.key}
              label={tab.label}
              defaultSplit={tab.defaultSplit}
              uploadedFiles={licensingFiles[tab.key]}
              onFilesChange={(files) => handleFilesChange(tab.key, files)}
              inheritedFiles={getInheritedFiles(tab.key)}
            />
          ) : null
        )}
      </div>

      {showHelp && <LicensingHelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default LicensingTabs;