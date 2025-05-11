// src/components/game/HomeGameList.js
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/game/HomeGameList.css";
import { useGameContext } from "../../context/gameContext";

const HomeGameList = () => {
  const { games, page, setPage } = useGameContext();
  const navigate = useNavigate();

  // 한 행당 최대 5개로 분할
  const gameRows = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < games.length; i += 5) {
      chunks.push(games.slice(i, i + 5));
    }
    return chunks;
  }, [games]);

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  return (
    <div className="home-game-list-container">
      {gameRows.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <div className="home-game-grid-row">
            {row.map((game) => (
              <div
                key={game.game_id}
                className="home-game-card"
                onClick={() => handleGameClick(game.game_id)}
              >
                <img
                  src={game.thumbnail_url}
                  alt={game.title}
                  className="home-game-thumbnail"
                />
                <div className="home-game-title">{game.title}</div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}

      <div className="pagination-controls">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          이전
        </button>
        <span className="pagination-current">페이지 {page}</span>
        <button onClick={() => handlePageChange(page + 1)}>
          다음
        </button>
      </div>
    </div>
  );
};

export default HomeGameList;