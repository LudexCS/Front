import React from "react";
import defaultGameImage from "../../assets/game-image.png";
import "../../styles/SearchGameList.css";

const dummyGames = Array.from({ length: 30 }, (_, i) => ({
  id: `게임${i + 1}의 gameId`,
  name: `게임${i + 1}`,
  thumbnail: defaultGameImage,
  price: `${(i + 1) * 1000} ₩`,
  tags: ["origin", "tag1", "tag2", "tag3"],
}));

const SearchGameList = ({ onSelectGame }) => {
  return (
    <div className="search-game-grid">
      {dummyGames.map((game) => (
        <div key={game.id} className="search-game-card" onClick={() => onSelectGame(game)}>
          <img src={game.thumbnail} alt={game.name} className="search-game-thumbnail" />
          <div className="search-game-title">{game.name}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchGameList;