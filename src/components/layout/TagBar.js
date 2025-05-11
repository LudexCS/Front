import React, { useEffect, useState } from "react";
import "../../styles/layout/TagBar.css";
import { useNavigate } from "react-router-dom";
import { getAllTags } from "../../api/tagsApi";

const TagBar = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await getAllTags();
            setTags(result);
        })();
    }, []);

    return (
        <div className="tag-container">
        {tags.map((tag) => (
            <button key={tag.id} className="tag" onClick={() => navigate(`/search/${tag.name}`)}>
            #{tag.name}
            </button>
        ))}
        </div>
    );
};

export default TagBar;