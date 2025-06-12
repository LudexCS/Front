import React from "react";
import "../../styles/game/GameDetailBar.css";
import { useNavigate } from "react-router-dom";
import Banner from "../layout/Banner";

const GameDetailBar = ({ game }) => {
  const navigate = useNavigate();

  if (!game) {
    return <div className="bar-game-banner"><Banner /></div>;
  }

  return (
    <div className="bar-game-detail">
      <img src={game.thumbnailUrl} alt={game.title} className="bar-game-detail-thumbnail" />
      <h2>{game.title}</h2>
      <p>
        {game.discountRate !== null && game.discountPrice !== null ? (
        <>
          <strong style={{ textDecoration: "line-through", color: "#888" }}>
            {game.price.toLocaleString()} $
          </strong>
          <br />
          <strong className="bar-discount-price">
            {game.discountPrice.toLocaleString()} $
          </strong>
          &nbsp; &nbsp;
          <span className="bar-discount-rate">({game.discountRate}%)</span>
        </>
        ) : (
          <strong>가격: {game.price.toLocaleString()} $</strong>
        )}
      </p>
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
