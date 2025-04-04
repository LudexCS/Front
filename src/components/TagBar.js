import React from "react";
import "./TagBar.css";
import { useNavigate } from "react-router-dom";

const tags = [
    "origin", "action", "adventure", "arcade", "battle", "card",
    "casual", "co-op", "cyberpunk", "dungeon", "fantasy", "fighting"
    // ,"fps", "horror", "indie", "jrpg", "mmo", "multiplayer",
    // "open-world", "platformer", "puzzle", "racing", "rpg", "sandbox",
    // "sci-fi", "simulation", "sports", "stealth", "strategy", "survival"
  ];
  

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