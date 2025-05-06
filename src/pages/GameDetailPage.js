import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResourceModal from "../components/modals/ResourceModal";
import PaymentModal from "../components/modals/PaymentModal";
import ReportModal from "../components/modals/ReportModal";
import NavbarSearch from "../components/layout/NavbarSearch";
import defaultGameImage from "../assets/game-image.png";
import "../styles/pages/GameDetailPage.css";

const GameDetailPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // TODO: API 호출하여 데이터 불러오기
  const game = {
    name: gameId,
    seller: "판매자",
    price: 10000,
    description: `${gameId}의 설명, ${gameId}의 설명, ${gameId}의 설명, ${gameId}의 설명, ${gameId}의 설명, ${gameId}의 설명, ${gameId}의 설명 `,
    tags: ["origin", "tag1", "tag2", "tag3", "ip001"],
    requirements: "Windows 10, 8GB RAM",
    resources: ["Resource1.png", "CharacterSet.wav"],
    gallery: [
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

  const mediaList = game.gallery;
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); // ✅ 초기값 0 → 첫번째 썸네일

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
            <h2>{game.name}</h2>
            <p><strong>{game.price.toLocaleString()} ₩</strong></p>
            <p>{game.description}</p>
            <div className="tags">
              {game.tags.map((tag, idx) => <span key={idx}>#{tag} </span>)}
            </div>
            <p>구동사양</p>
            <p>{game.requirements}</p>
            <p className="resource-link" onClick={() => setShowResourceModal(true)}>리소스</p>
          </div>
          <div className="action-buttons">
            <button onClick={() => navigate(-1)}>Back</button>
            <button onClick={() => setShowPaymentModal(true)}>Buy</button>
          </div>
        </div>

        {showResourceModal && (
          <ResourceModal
            game={{
              name: game.name,
              resources: {
                모드: [
                  { name: "space_theme.mp3", desc: "우주 테마 배경음악", previewUrl: "/preview/space_theme" },
                  { name: "alien_pack.zip", desc: "외계인 캐릭터 리소스", previewUrl: "/preview/alien_pack" },
                ],
                확장판: [
                  { name: "level2_map.json", desc: "레벨 2 확장 맵", previewUrl: "/preview/level2_map" },
                ],
                후속작: [
                  { name: "new_story.pdf", desc: "후속작 스토리 시놉시스", previewUrl: "/preview/new_story" },
                ],
              },
              contracts: {
                모드: "수익 분배: ludex 10%, 판매자 30%, 구매자 70%\n2차 파생 허용: 예\n외부 업로드 제한: 있음",
                확장판: "수익 분배: ludex 10%, 판매자 20%, 구매자 80%\n2차 파생 허용: 아니오\n외부 업로드 제한: 없음",
                후속작: "수익 분배: ludex 10%, 판매자 10%, 구매자 90%\n2차 파생 허용: 예\n외부 업로드 제한: 있음",
              }
            }}
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