import React from "react";
import FileUploader from "./FileUploader";
import "../../styles/upload/LicensingTabPane.css";

const LicensingTabPane = ({
  type,
  label,
  defaultSplit,
  uploadedFiles,
  onFilesChange,
  inheritedFiles
}) => {
  const [sellerShare, setSellerShare] = React.useState(defaultSplit.seller);
  const [buyerShare, setBuyerShare] = React.useState(defaultSplit.buyer);
  const [extra, setExtra] = React.useState("");
  const [allowDerivative, setAllowDerivative] = React.useState(false);
  const [blockExport, setblockExport] = React.useState(false);

  return (
    <div className="licensing-pane">
      <h4>{label} 용도 리소스 업로드</h4>

      <FileUploader
        files={uploadedFiles}
        setFiles={onFilesChange}
        maxFiles={10}
        showDescriptionInput={true}
      />

      {inheritedFiles.length > 0 && (
        <>
          <p>상속된 리소스 목록:</p>
          <ul className="file-list">
            {inheritedFiles.map((entry, idx) => (
              <li key={idx}>
                {entry.file.name}
                {entry.description && <span> - {entry.description}</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      <h4>수익 배분 비율 설정</h4>
      <div className="revenue-split">
        <p>플랫폼: 10%</p>
        <label>판매자 (%):</label>
        <input
          type="number"
          value={sellerShare}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setSellerShare(value);
            setBuyerShare(90 - value);
          }}
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
      <label>
        <input
          type="checkbox"
          checked={blockExport}
          onChange={() => setblockExport(!blockExport)}
        />
        외부 업로드 제한
      </label>

      <label>추가 조건:</label>
      <textarea value={extra} onChange={(e) => setExtra(e.target.value)} />
    </div>
  );
};

export default LicensingTabPane;