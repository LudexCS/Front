import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/game/RelatedGameList.css";
import defaultGameImage from "../../assets/game-image.png";
import { fetchOriginGameList, fetchVariantGameList } from "../../api/gameGetApi";

const RelatedGameList = ({ gameId }) => {
  const navigate = useNavigate();
  const [relatedGames, setRelatedGames] = useState([]);

  useEffect(() => {
    if (!gameId) {
      setRelatedGames([]);
      return; 
    }

    const fetchRelatedGames = async () => {
      try {
        const originList = await fetchOriginGameList({ gameId });
        const variantList = await fetchVariantGameList({ gameId });
        setRelatedGames([...originList, ...variantList]);
      } catch (error) {
        console.error("게임 관련 항목을 불러오는 데 실패:", error);
      }
    };

    fetchRelatedGames();
  }, [gameId]);

  return (
    <div className="related-games-list">
      {relatedGames.map((game) => (
        <div
          key={game.gameId}
          className="related-game-item"
          onClick={() => {
            setRelatedGames([]);
            navigate(`/game/${game.gameId}`);
          }}
        >
          <img
            src={game.thumbnailUrl || defaultGameImage}
            alt={game.title}
            className="related-game-thumbnail"
          />
          <div className="related-game-title">{game.title}</div>
        </div>
      ))}
    </div>
  );
};

export default RelatedGameList;