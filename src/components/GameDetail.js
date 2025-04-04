import React from "react";
import "./GameDetail.css";
import { useNavigate } from "react-router-dom";

const GameDetail = ({ game }) => {
  const navigate = useNavigate();

  if (!game) {
    return <div className="game-banner">게임을 선택하세요.</div>;
  }

  return (
    <div className="game-detail">
      <img src={game.thumbnail} alt={game.name} className="game-thumbnail" />
      <h2>{game.name}</h2>
      <p>{game.price}</p>
      <p>게임의 설명</p>

      {/* ✅ 태그 클릭 시 검색 이동 */}
      <div className="tags">
        {game.tags.map((tag, index) => (
          <button key={index} className="tag" onClick={() => navigate(`/search/${tag}`)}>
            #{tag}
          </button>
        ))}
      </div>

      {/* ✅ 상세 페이지 이동 버튼 추가 */}
      <button className="detail-button" onClick={() => navigate(`/game/${game.id}`)}>
        상세 페이지로 이동
      </button>
    </div>
  );
};

export default GameDetail;
