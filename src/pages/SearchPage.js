import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SearchBar from "../components/layout/SearchBar";
import SearchGameList from "../components/game/SearchGameList";
import GameDetailBar from "../components/game/GameDetailBar";
import TagBar from "../components/layout/TagBar";
import { fetchGamesByTags } from "../api/gameGetApi";
import "../styles/pages/SearchPage.css";

const SearchPage = () => {
  const { query } = useParams(); // URL에서 검색어 가져오기
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState(null);

  useEffect(() => {
    setSelectedGame(null); // 검색어가 바뀌면 선택된 게임 초기화
  }, [query]);

  // 게임 선택 토글 (같은 게임을 다시 선택하면 해제)
  const handleGameSelect = (game) => {
    setSelectedGame((prev) => (prev?.gameId === game.gameId ? null : game));
  };

  useEffect(() => {
      const fetchGames = async () => {
        if (!query || query.trim() === "") {
          setGames([]);
          return;
        }
  
        try {
          const tags = query.split(",").map(tag => tag.trim()).filter(Boolean);
          const response = await fetchGamesByTags({ tags });
          console.log("게임 목록 불러오기", response);
          setGames(response);
        } catch (error) {
          console.error("게임 목록 불러오기 실패:", error);
        }
      };
  
      fetchGames();
    }, [query]);

  return (
    <div>
      <Navbar />
      <div className="search-page-container">
        <div className="search-page">
          <SearchBar/>
          <TagBar/>
        </div>
        <div className="search-content">
          <div className="search-content-left">
            <SearchGameList onSelectGame={handleGameSelect} games={games} />
          </div>
          <div className="search-content-right">
            <GameDetailBar game={selectedGame} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
