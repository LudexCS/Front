import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/layout/SearchBar.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { query } = useParams();

  useEffect(() => {
    setSearchText(query);
    }, [query]);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search/${searchText}`);
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
    </div>
  );
};

export default SearchBar;
