import React, { useState } from "react";

const LicensingForm = () => {
  const [sellerShare, setSellerShare] = useState(50);
  const [buyerShare, setBuyerShare] = useState(50);
  const [extra, setExtra] = useState("");

  return (
    <div className="licensing-form">
      <h4>리소스 업로드</h4>
      <input type="file" multiple />

      <h4>IP Licensing Agreement</h4>
      <label>판매자 (%):</label>
      <input
        type="number"
        value={sellerShare}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          setSellerShare(val);
          setBuyerShare(100 - val);
        }}
      />
      <label>구매자 (%):</label>
      <input type="number" value={buyerShare} disabled />

      <label>추가 조건:</label>
      <textarea value={extra} onChange={(e) => setExtra(e.target.value)} />
    </div>
  );
};

export default LicensingForm;