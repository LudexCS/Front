import React from "react";
import "../../styles/ResourceModal.css";

const ResourceModal = ({ resources, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>리소스 목록</h3>
      <ul>
        {resources.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      <button onClick={onClose}>닫기</button>
    </div>
  </div>
);

export default ResourceModal;