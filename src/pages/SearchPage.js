import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SearchGameList from "../components/SearchGameList";
import GameDetail from "../components/GameDetail";
import "./SearchPage.css";

const SearchPage = ({isLoggedIn}) => {
  const { query } = useParams(); // URL에서 검색어 가져오기
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    setSelectedGame(null); // 검색어가 바뀌면 선택된 게임 초기화
  }, [query]);

  // 게임 선택 토글 (같은 게임을 다시 선택하면 해제)
  const handleGameSelect = (game) => {
    setSelectedGame((prev) => (prev?.id === game.id ? null : game));
  };

  return (
    <div>
    <Navbar isLoggedIn={isLoggedIn}/>
    <div className="search-page">
      <SearchBar/>
    </div>
    <div className="content">
      <SearchGameList onSelectGame={handleGameSelect} />
      <GameDetail game={selectedGame} />
    </div>
    </div>
  );
};

export default SearchPage;
