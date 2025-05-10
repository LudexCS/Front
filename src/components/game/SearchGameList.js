import React, { useEffect, useState } from "react";
import defaultGameImage from "../../assets/game-image.png";
import "../../styles/game/SearchGameList.css";

// 예시용 더미 게임 목록
const dummyGames = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  title: `게임${i + 1}`,
  // userId: 0,
  price: (i + 1) * 1000,
  thumbnailUrl: defaultGameImage,
  description: "간단한 설명 텍스트",
  // item_id: BigInt(i + 1000), // BigInt 사용
  // registeredAt: new Date().toISOString(),
  // updatedAt: new Date().toISOString(),
  tags: ["origin", "tag1", "tag2"],
  // imageUrls: [defaultGameImage],
  // requirements: [
  //   {
  //     os: "Windows",
  //     cpu: "i5 이상",
  //     ram: "8GB",
  //     gpu: "GTX 1060",
  //     storage: "20GB",
  //   },
  // ],
}));

const SearchGameList = ({ onSelectGame, query }) => {
  const [games, setGames] = useState(dummyGames);

  /*
  // 실제 API 연동 시 사용
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetchGamesByTags(query);
        setGames(response);
      } catch (error) {
        console.error("게임 목록 불러오기 실패:", error);
      }
    };

    fetchGames();
  }, [query]);
  */

  return (
    <div className="search-game-grid">
      {games.map((game) => (
        <div
          key={game.id}
          className="search-game-card"
          onClick={() => onSelectGame(game)}
        >
        <img
          src={game.thumbnailUrl || defaultGameImage}
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