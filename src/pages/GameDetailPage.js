import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResourceModal from "../components/modals/ResourceModal";
import PaymentModal from "../components/modals/PaymentModal";
import ReportModal from "../components/modals/ReportModal";
import NavbarSearch from "../components/layout/NavbarSearch";
import RelatedGameList from "../components/game/RelatedGameList";
import { fetchGameDetail, fetchGameResource } from "../api/gameGetApi";
import "../styles/pages/GameDetailPage.css";

const GameDetailPage = () => { 
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [resource, setResource] = useState(null);
  const navigate = useNavigate();
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchGameDetail({ gameId });
        setGame(result);
      } catch (err) {
        console.error("게임 상세 정보를 불러오는 데 실패했습니다", err);
        navigate("/"); // optional: 실패 시 이동
      }
      try {
        const result = await fetchGameResource({ gameId });
        setResource(result);
      } catch (err) {
        console.error("게임 리소스 정보를 불러오는 데 실패했습니다", err);
        // navigate("/"); // optional: 실패 시 이동
      }
    })();
  }, [gameId, navigate]);

  if (!game) {
    return (
      <div>
        <NavbarSearch />
        <div className="game-detail-container">Loading...</div>
      </div>
    );
  }
  
  const mediaList = game.imageUrls;
  const mainMedia = mediaList[selectedMediaIndex];

  return (
    <div>
      <NavbarSearch />
      <div className="game-detail-container">
        <div className="game-detail-left">
          <div className="media-wrapper">
            <div className="main-media-box">
              <img className="main-media" src={mainMedia} alt="메인 미디어" />
            </div>
            <div className="sub-media-box">
              {mediaList.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`sub-${idx}`}
                  className={`sub-media ${idx === selectedMediaIndex ? 'selected' : ''}`}
                  onClick={() => setSelectedMediaIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="game-detail-right">
          <p className="report-button" onClick={() => setShowReportModal(true)}>report</p>
          <div className="game-detail-info">
            <h2>{game.title}</h2>
            <p>
              {game.discountRate !== null && game.discountPrice !== null ? (
                <>
                  {/* <strong>가격: </strong> */}
                  <strong style={{ textDecoration: "line-through", color: "#888" }}>
                    {game.price.toLocaleString()} $
                  </strong>
                  <br />
                  <strong className="detail-discount-price">
                    {game.discountPrice.toLocaleString()} $
                  </strong>
                  &nbsp; &nbsp;
                  <span className="detail-discount-rate">({-100*game.discountRate}%)</span>
                </>
              ) : (
                <strong>가격: {game.price.toLocaleString()} $</strong>
              )}
            </p>
            <p><strong>제작자: {game.nickName}</strong></p>
            <p>
              <strong>설명: </strong>
              <br />
              {game.description}
            </p>
            <div className="tags">
              {game.tags.map((tag, idx) => <span key={idx}>#{tag} </span>)}
            </div>
            <p><strong>구동사양 </strong></p>
            <ul className="game-detail-requirement-list">
              {game.requirements.map((req, idx) => (
                <li key={idx}>
                  <div>OS: {req.os}</div>
                  <div>CPU: {req.cpu}</div>
                  <div>GPU: {req.gpu}</div>
                  <div>RAM: {req.ram}</div>
                  <div>저장공간: {req.storage}</div>
                  <div>네트워크: {req.network}</div>
                </li>
              ))}
            </ul>
            <p className="resource-link" onClick={() => setShowResourceModal(true)}>리소스</p>
          </div>
          <div className="action-buttons">
            <button onClick={() => {
              navigate(-1);
              navigate("/");
              }}>Back</button>
            <button onClick={() => setShowPaymentModal(true)}>Buy</button>
          </div>
        </div>

        {showResourceModal && (
          <ResourceModal resource={resource} onClose={() => setShowResourceModal(false)} />
        )}
        {showPaymentModal && (
          <PaymentModal game={game} onClose={() => setShowPaymentModal(false)} />
        )}
        {showReportModal && (
          <ReportModal gameId={gameId} onClose={() => setShowReportModal(false)} />
        )}
      </div>
      <RelatedGameList gameId={gameId} />
    </div>
  );
};

export default GameDetailPage;