import React from "react";
import "../../styles/layout/TagBar.css";
import { useNavigate } from "react-router-dom";
import tags from "../../context/Tags";

const TagBar = ({ onTagClick }) => {
    const navigate = useNavigate();

    return (
        <div className="tag-container">
        {tags.map((tag) => (
            <button key={tag.tagId} className="tag" onClick={() => navigate(`/search/${tag.name}`)}>
            #{tag.name}
            </button>
        ))}
        </div>
    );
};

export default TagBar;