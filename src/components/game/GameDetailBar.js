import React from "react";
import "../../styles/game/GameDetailBar.css";
import { useNavigate } from "react-router-dom";

const GameDetailBar = ({ game }) => {
  const navigate = useNavigate();

  if (!game) {
    return <div className="bar-game-banner">게임을 선택하세요.</div>;
  }

  return (
    <div className="bar-game-detail">
      <img src={game.thumbnailUrl} alt={game.title} className="bar-game-detail-thumbnail" />
      <h2>{game.title}</h2>
      <p>{game.price}</p>
      <p>{game.description}</p>

      <div className="bar-tag">
        {game.tags.map((tag, index) => (
          <button key={index} className="bar-tags" onClick={() => navigate(`/search/${tag}`)}>
            #{tag}
          </button>
        ))}
      </div>

      <button className="bar-detail-button" onClick={() => navigate(`/game/${game.gameId}`)}>
        상세 페이지로 이동
      </button>
    </div>
  );
};

export default GameDetailBar;
