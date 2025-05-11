import React from "react";
import "../../styles/game/SearchGameList.css";

const SearchGameList = ({ onSelectGame, games }) => {
  return (
    <div className="search-game-grid">
      {(games || []).map((game) => (
        <div
          key={game.gameId}
          className="search-game-card"
          onClick={() => onSelectGame(game)}
        >
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="search-game-thumbnail"
          />
          <div className="search-game-title">{game.title}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchGameList;