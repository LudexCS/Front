import React, { useEffect, useState } from "react";
import { getBanner } from "../../api/tagsApi";
import "../../styles/layout/Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBanner(); // 예: [{id, title, imageUrl, linkUrl}, ...]
        setBanners(data || []);
      } catch (err) {
        console.error("배너 조회 실패:", err);
      }
    };
    fetchBanner();
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) {
    return <div className="banner-container">배너 없음</div>;
  }

  const banner = banners[index];

  return (
    <div className="banner-container">
      <div className="banner-nav left" onClick={handlePrev}>
        &lt;
      </div>
      <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
        <img src={banner.imageUrl} alt={banner.title} className="banner-image" />
      </a>
      <div className="banner-nav right" onClick={handleNext}>
        &gt;
      </div>
    </div>
  );
};

export default Banner;