import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from "./pages/MyPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import GameUploadPage from "./pages/GameUploadPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(Router);

  return (
    <Routes>
      <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/my" element={<MyPage isLoggedIn={isLoggedIn} />} />
      <Route path="/search/:query" element={<SearchPage isLoggedIn={isLoggedIn}/>} />
      <Route path="edit" element={<EditProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
      <Route path="submit" element={<GameUploadPage isLoggedIn={isLoggedIn}/>}/>
    </Routes>
  );
}

export default App;