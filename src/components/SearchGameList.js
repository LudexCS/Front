import React from "react";
import "../styles/SearchGameList.css";

const dummyGames = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `게임${i + 1}`,
  thumbnail: `https://via.placeholder.com/100?text=Game${i + 1}`,
  price: `${(i + 1) * 1000} ₩`,
  tags: ["origin", "tag1", "tag2", "tag3"],
}));

const SearchGameList = ({ onSelectGame }) => {
  return (
    <div className="game-grid">
      {dummyGames.map((game) => (
        <div key={game.id} className="game-card" onClick={() => onSelectGame(game)}>
          <img src={game.thumbnail} alt={game.name} className="game-thumbnail" />
          <div className="game-title">{game.name}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchGameList;