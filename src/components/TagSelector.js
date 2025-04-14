import React from "react";
import tags from "../context/Tags";
import "../styles/TagSelector.css";

const TagSelector = ({ selectedTags, setSelectedTags }) => {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
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
  );
};

export default TagSelector;