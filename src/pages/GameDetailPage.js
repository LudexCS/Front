import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResourceModal from "../components/modals/ResourceModal";
import PaymentModal from "../components/modals/PaymentModal";
import ReportModal from "../components/modals/ReportModal";
import NavbarSearch from "../components/layout/NavbarSearch";
import defaultGameImage from "../assets/game-image.png";
import { fetchGameDetail } from "../api/gameGetApi";
import "../styles/pages/GameDetailPage.css";

const GameDetailPage = () => { 
  const { gameId } = useParams();
  // const [ game, setGame] = useState(null);
  // const [ resource, setResource] = useState(null);
  const navigate = useNavigate();

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const result1 = await fetchGameDetail(gameId);
  //     setGame(result1);
  //     const result2 = await fetchGameResource(gameId);
  //     setResource(result2);
  //   })();
  // }, [gameId]);

  // TODO: API 호출하여 데이터 불러오기
  const game =   {
    id: 1,
    title: gameId,
    seller: "판매자",
    price: 10,
    description: `${gameId}의 설명`,
    tags: ["origin", "tag1", "tag2"],
    requirements: [{
      os: "Windows 10",
      cpu: "Intel i5",
      gpu: "NVIDIA GTX 1050",
      ram: "8GB",
      storage: "15GB",
      network: "Broadband Internet"
    }],
    imageUrls: [
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
    ],
  };

  const resource={
    game: game.title,
    description: "High-resolution character sprites for use in RPGs.High-resolution character sprites for use in RPGs.High-resolution character sprites for use in RPGs.High-resolution character sprites for use in RPGs.", 
    imageUrls: [
      defaultGameImage,
      defaultGameImage,
      defaultGameImage,
      "https://ludex-cdn.s3.ap-northeast-2.amazonaws.com/images/12_1.jpg?X-Amz-Signature=...",
      "https://ludex-cdn.s3.ap-northeast-2.amazonaws.com/images/12_2.jpg?X-Amz-Signature=..."
    ],
    sellerRatio: 30,
    creatorRatio: 70,
    allowDerivation: true,
    additionalCondition: "You must credit the original creator.",
  };

  const mediaList = game.imageUrls;
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

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
            <p><strong>{game.price.toLocaleString()} $</strong></p>
            <p>{game.description}</p>
            <div className="tags">
              {game.tags.map((tag, idx) => <span key={idx}>#{tag} </span>)}
            </div>
            <p>구동사양</p>
            <ul className="game-detail-requirement-list">
              {game.requirements.map((req, idx) => (
                <p key={idx}>
                  <div>OS: {req.os}</div>
                  <div>CPU: {req.cpu}</div>
                  <div>GPU: {req.gpu}</div>
                  <div>RAM: {req.ram}</div>
                  <div>저장공간: {req.storage}</div>
                  <div>네트워크: {req.network}</div>
                </p>
              ))}
            </ul>
            <p className="resource-link" onClick={() => setShowResourceModal(true)}>리소스</p>
          </div>
          <div className="action-buttons">
            <button onClick={() => navigate(-1)}>Back</button>
            <button onClick={() => setShowPaymentModal(true)}>Buy</button>
          </div>
        </div>

        {showResourceModal && (
          <ResourceModal
            resource={resource}
            onClose={() => setShowResourceModal(false)}
          />
        )}
        {showPaymentModal && <PaymentModal game={game} onClose={() => setShowPaymentModal(false)} />}
        {showReportModal && <ReportModal gameId={gameId} onClose={() => setShowReportModal(false)} />}
      </div>
    </div>
  );
};

export default GameDetailPage;