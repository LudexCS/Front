import React, { useState } from "react";
import "../../styles/modals/PreviewModal.css";

const PreviewModal = ({ images, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex];

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal-content">
        <button className="preview-close-button" onClick={onClose}>x</button>
        <div className="preview-main-media-box">
          <img className="preview-main-media" src={mainImage} alt="메인 미리보기" />
        </div>
        <div className="preview-sub-media-box">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`sub-${idx}`}
              className={`preview-sub-media ${idx === selectedIndex ? "selected" : ""}`}
              onClick={() => setSelectedIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;