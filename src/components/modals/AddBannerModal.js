import React, { useState } from "react";
import FileUploader from "../upload/FileUploader";
import "../../styles/modals/AddBannerModal.css";

const AddBannerModal = ({ onClose }) => {
  const [files, setFiles] = useState([]);
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
    try {
      const imageFile = files[0]?.file;
      if (!imageFile) {
        alert("배너 이미지를 업로드해주세요.");
        return;
      }

      // 👇 배너 생성 API 위치
      // const formData = new FormData();
      // formData.append("image", imageFile);
      // formData.append("title", form.title);
      // formData.append("linkUrl", form.linkUrl);
      // formData.append("priority", form.priority);
      // formData.append("startsAt", form.startsAt);
      // formData.append("endsAt", form.endsAt);
      // await yourApi.createBanner(formData);

      alert("배너가 등록되었습니다!");
      onClose();
    } catch (error) {
      console.error("배너 추가 실패:", error);
    }
  };

  return (
    <div className="admin-add-banner-modal">
      <div className="admin-add-banner-content">
        <h2>배너 추가</h2>

        <div className="admin-add-banner-group">
          <label>파일 업로드</label>
          <FileUploader maxFiles={1} files={files} setFiles={setFiles} />
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
  );
};

export default AddBannerModal;