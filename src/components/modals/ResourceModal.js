import React, { useState, useEffect } from "react";
import "../../styles/modals/ResourceModal.css";
import PreviewModal from "./PreviewModal";
import { useNavigate } from "react-router-dom";
import { purchaseResource } from "../../api/purchaseApi";
import { useUser } from "../../context/UserContext";
import { useRecord } from "../../context/RecordContext";

const ResourceModal = ({ resource, onClose }) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { isLoggedIn } = useUser();
  const { setIsFetch } = useRecord();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if(!isLoggedIn){
      alert("회원 정보가 필요합니다.");
      navigate("/login");
    }
    try {
      await purchaseResource({ resourceId: resource.id });
      alert("리소스 구매가 완료되었습니다.");
      setIsFetch(true);
      onClose();
    } catch (err) {
      alert("리소스 구매에 실패했습니다.");
    }
  };

  useEffect(() => {
    setIsFetch(false);
  }, []);

  if (!resource.id) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>리소스가 없습니다.</p>
          <div className="modal-actions">
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          {/* <h2>{resource.gameId}</h2> */}

          <button onClick={() => setShowPreviewModal(true)}>미리보기 imgaes</button>

          <div className="resource-section">
            <h3>리소스 설명</h3>
            <pre>{resource.description}</pre>
          </div>

          <div className="contract-section">
            <h3>계약 조건</h3>
            <p>
            아래 명시된 계약 조건을 확인 후 Checkout을 진행해 주세요.<br />
            위반 시 서비스 이용이 제한되며, 법적 책임이 발생할 수 있습니다.
            </p>
            <pre>수익 분배: ludex 10%, 판매자 {resource.sellerRatio}%, 구매자 {resource.creatorRatio}%</pre>
            <pre>2차 파생 허용: {resource.allowDerivation? "Yes" : "No"}</pre>
            <pre>추가 조건: {resource.additionalCondition}</pre>
          </div>

          <div className="modal-actions">
            <button onClick={onClose}>Back</button>
            <button className="checkout" onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      </div>

      {showPreviewModal && (
        <PreviewModal
          images={resource.imageUrls}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </>
  );
};

export default ResourceModal;