import React from "react";
import Navbar from "../components/layout/Navbar";
import Banner from "../components/layout/Banner";
import HomeGameList from "../components/game/HomeGameList";
import SearchBar from "../components/layout/SearchBar";
import "../styles/pages/HomePage.css";

const HomePage = () => {
    return (
        <div>
          <Navbar />
          <div className="home-container">
            <div className="home-top-section">
              <Banner />
              <SearchBar />
            </div>
            <div className="bottom-section">
              <HomeGameList />
            </div>
            
          </div>
        </div>
    );
};

export default HomePage;