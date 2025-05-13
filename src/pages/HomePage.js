import React from "react";
import NavbarSearch from "../components/layout/NavbarSearch";
import Banner from "../components/layout/Banner";
import HomeGameList from "../components/game/HomeGameList";
import TagBar from "../components/layout/TagBar";
import "../styles/pages/HomePage.css";

const HomePage = () => {
    return (
        <div>
          <NavbarSearch />
          <div className="home-container">
            <div className="home-top-section">
              <Banner />
              <TagBar />
            </div>
            <div className="bottom-section">
              <HomeGameList />
            </div>
            
          </div>
        </div>
    );
};

export default HomePage;