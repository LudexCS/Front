import React, { useState } from "react";
import TagBar from "./TagBar";
import "../../styles/SearchBar.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search/${searchText}`);
      setSearchText("");
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>
      <TagBar/>
    </div>
  );
};

export default SearchBar;
