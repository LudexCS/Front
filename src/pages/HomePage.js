import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import HomeGameList from "../components/HomeGameList";
import SearchBar from "../components/SearchBar";
import "../styles/HomePage.css";

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