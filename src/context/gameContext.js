import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchGameList } from "../api/gameGetApi";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const limit = 15;
  const [games, setGames] = useState([]);
  const [isUpload, setIsUpload] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const gameList = await fetchGameList({ page, limit });
        setGames(gameList);
      } catch (error) {
        console.error("게임 목록을 가져오는 데 실패:", error);
      }
    };

    loadGames();
  }, [page, isUpload]);

  return (
    <GameContext.Provider value={{ page, setPage, games, setIsUpload, searchTerm, setSearchTerm, contents, setContents }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);