import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/game/HomeGameList.css";
import defaultGameImage from "../../assets/game-image.png";

// 더미 데이터 생성
const generateDummyGames = () => {
  const games = [];
  for (let i = 1; i <= 30; i++) {
    const variantCount = Math.floor(Math.random() * 7) + 2; // 2~8개의 Variant
    const variants = Array.from({ length: variantCount }, (_, idx) => `Variant ${idx + 1} gameId`);
    games.push({
      id: i,
      name: `Game ${i}`,
      thumbnail: defaultGameImage,
      variants: ["Origin gameId", ...variants],
    });
  }
  return games;
};

// 배열을 chunk 단위로 나누는 함수 (여기서는 5개씩)
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const HomeGameList = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const navigate = useNavigate();
  const games = generateDummyGames();
  const gameRows = chunkArray(games, 5); // 5개씩 그룹화

  const handleGameClick = (game) => {
    setSelectedGame((prev) => (prev?.id === game.id ? null : game));
  };

  return (
    <div className="home-game-list-container">
      {gameRows.map((row, rowIndex) => {
        // 행(row) 안에서 선택된 게임이 있는지 확인
        const selectedInRow = row.find(game => selectedGame && game.id === selectedGame.id);
        return (
          <React.Fragment key={rowIndex}>
            {/* 게임 카드가 5개씩 나오는 행 */}
            <div className="home-game-grid-row">
              {row.map((game) => (
                <div key={game.id} className="home-game-card" onClick={() => handleGameClick(game)}>
                  <img src={game.thumbnail} alt={game.name} className="home-game-thumbnail" />
                  <div className="home-game-title">{game.name}</div>
                </div>
              ))}
            </div>
            {/* 해당 행에 선택된 게임이 있으면, 그 행 바로 아래에 Variant 목록 표시 */}
            {selectedInRow && (
              <div className="home-variant-list">
                {selectedGame.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="home-variant-item"
                    onClick={() => navigate(`/game/${variant}`)}
                  >
                    <img src={selectedGame.thumbnail} alt={variant} className="home-variant-thumbnail" />
                    <div className="home-variant-title">{variant}</div>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default HomeGameList;
