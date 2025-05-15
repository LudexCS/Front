// LoadingModal.js
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/modals/LoadingModal.css";

const LoadingModal = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dots = ".".repeat(dotCount);

  return ReactDOM.createPortal(
    <div className="loading-modal-overlay">
      <div className="loading-modal-spinner" />
      <div className="loading-modal-text">처리 중{dots}</div>
    </div>,
    document.body
  );
};

export default LoadingModal;