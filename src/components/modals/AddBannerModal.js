import React, { useState } from "react";
import FileUploader from "../upload/FileUploader";
import "../../styles/modals/AddBannerModal.css";
import LoadingModal from "./LoadingModal";
import { addAdminBanner } from "../../api/adminApi";

const AddBannerModal = ({ onClose, setIsFetch }) => {
  const [file, setFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    linkUrl: "",
    priority: "",
    startsAt: "",
    endsAt: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBanner = async () => {
    const imageFile = file[0]?.file;
    if (!imageFile) {
    alert("배너 이미지를 업로드해주세요.");
    return;
    }
    try {
      setIsUploading(true);
      alert("배너를 등록합니다.");
      await addAdminBanner({
        title: form.title,
        linkUrl: form.linkUrl,
        visible: true,
        priority: form.priority,
        startsAt: form.startsAt,
        endsAt: form.endsAt
      }, file[0])
      alert("배너가 등록되었습니다.");
      setIsFetch(true);
      onClose();
    } catch (error) {
      console.error("배너 추가 실패:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
    {isUploading && <LoadingModal />}
    <div className="admin-add-banner-modal">
      <div className="admin-add-banner-content">
        <h2>배너 추가</h2>

        <div className="admin-add-banner-group">
          <label>파일 업로드</label>
          <FileUploader maxFiles={1} files={file} setFiles={setFile} />
        </div>

        <div className="admin-add-banner-group">
          <label>배너명</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="title"
          />
        </div>

        <div className="admin-add-banner-group">
          <label>연결 url</label>
          <input
            type="text"
            name="linkUrl"
            value={form.linkUrl}
            onChange={handleChange}
            placeholder="url"
          />
        </div>

        <div className="admin-add-banner-group">
          <label>우선순위</label>
          <input
            type="number"
            name="priority"
            min="1"
            max="10"
            value={form.priority}
            onChange={handleChange}
            placeholder="1~10"
          />
        </div>

        <div className="admin-add-banner-group">
          <label>노출 기간</label>
          <div className="admin-add-banner-dates">
            <input
              type="datetime-local"
              name="startsAt"
              value={form.startsAt}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="endsAt"
              value={form.endsAt}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="admin-add-banner-actions">
          <button onClick={onClose}>Back</button>
          <button onClick={handleAddBanner}>Add</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddBannerModal;