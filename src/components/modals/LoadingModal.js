import React, { useEffect, useState } from "react";
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

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-content">
        <p>등록 중{dots}</p>
      </div>
    </div>
  );
};

export default LoadingModal;