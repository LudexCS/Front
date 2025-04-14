import React from "react";
import "../../styles/TagBar.css";
import { useNavigate } from "react-router-dom";
import tags from "../../context/Tags";

const TagBar = ({ onTagClick }) => {
    const navigate = useNavigate();

    return (
        <div className="tag-container">
        {tags.map((tag, index) => (
            <button key={index} className="tag" onClick={() => navigate(`/search/${tag}`)}>
            #{tag}
            </button>
        ))}
        </div>
    );
};

export default TagBar;