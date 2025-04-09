import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import LicensingForm from "../components/LicensingForm";
import Navbar from "../components/Navbar";
import tags from "../context/Tags";
import "./GameUploadPage.css";

const GameUploadPage = () => {
  const [category, setCategory] = useState("origin");
  const [selectedIPs, setSelectedIPs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleIPChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedIPs(values);
    console.log(selectedIPs);
  };

  const handleSubmit = () => {
    if (selectedTags.length === 0) {
      alert("태그를 하나 이상 선택해주세요!");
      return;
    }
    alert("게임이 등록되었습니다.");
    window.location.href = "/my";
  };

  return (
    <div>
      <Navbar />
      <div className="upload-page">
        <h2>이미지&영상 파일 업로드</h2>
        <FileUploader maxFiles={5} />

        <div className="form-section">
          <label>게임명:</label>
          <input type="text" />
          <label>가격:</label>
          <input type="text" />
          <label>게임설명:</label>
          <textarea />
          <label>구동사양:</label>
          <textarea />
        </div>

        <div className="tag-section">
          <label>태그 (최소 1개):</label>
          <div className="tag-buttons">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="category-section">
          <label>분류:</label>
          <label>
            <input
              type="radio"
              name="category"
              value="origin"
              checked={category === "origin"}
              onChange={() => setCategory("origin")}
            />
            Origin
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="variant"
              checked={category === "variant"}
              onChange={() => setCategory("variant")}
            />
            Variant
          </label>
        </div>

        {category === "origin" ? (
          <LicensingForm />
        ) : (
          <div className="ip-select">
            <label>사용 게임 IP:</label>
            <select multiple onChange={handleIPChange}>
              <option value="ip1">구매한 게임 A</option>
              <option value="ip2">구매한 게임 B</option>
              <option value="ip3">구매한 게임 C</option>
              {/* 실제 사용 시 API 등에서 동적으로 불러올 수 있음 */}
            </select>
          </div>
        )}

        <div className="action-buttons">
          <button>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default GameUploadPage;
