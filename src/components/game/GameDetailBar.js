import React from "react";
import "../../styles/GameDetailBar.css";
import { useNavigate } from "react-router-dom";

const GameDetailBar = ({ game }) => {
  const navigate = useNavigate();

  if (!game) {
    return <div className="bar-game-banner">게임을 선택하세요.</div>;
  }

  return (
    <div className="bar-game-detail">
      <img src={game.thumbnail} alt={game.name} className="bar-game-thumbnail" />
      <h2>{game.name}</h2>
      <p>{game.price}</p>
      <p>게임의 설명</p>

      <div className="bar-tag">
        {game.tags.map((tag, index) => (
          <button key={index} className="bar-tags" onClick={() => navigate(`/search/${tag}`)}>
            #{tag}
          </button>
        ))}
      </div>

      <button className="bar-detail-button" onClick={() => navigate(`/game/${game.id}`)}>
        상세 페이지로 이동
      </button>
    </div>
  );
};

export default GameDetailBar;
