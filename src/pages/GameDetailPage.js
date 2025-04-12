import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import "../styles/GameDetailPage.css";

const GameDetailPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="game-detail-page">
      <h1>Game Detail Page</h1>
      <p>게임 ID: {gameId}</p>
      <p>여기에 게임 상세 정보를 불러와서 보여줄 예정입니다.</p>
      <p onClick={()=>{navigate("/")}}>Back</p>
    </div>
  );
};

export default GameDetailPage;