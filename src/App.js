import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from "./components/Navbar";
import MyPage from "./pages/MyPage";
import SearchPage from "./pages/SearchPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/my" element={<MyPage isLoggedIn={isLoggedIn} />} />
      <Route path="/search/:query" element={<SearchPage isLoggedIn={isLoggedIn}/>} />
      {/* <Route path="/signup" element={<Signup />} />
          <Route
            path="/routine/:id"
            element={<RoutineDetail setSelectedStore={setSelectedStore} />} // 루틴 상세 페이지
          />
          <Route
            path="/routine/new"
            element={<RoutineDetail setSelectedStore={setSelectedStore} />} // 루틴 생성 페이지
          />
          <Route
            path="/check"
            element={<CheckView userId={options.userId} />} // 주문 내역 페이지
          /> */}
    </Routes>
  );
}

export default App;