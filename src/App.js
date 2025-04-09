import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from "./pages/MyPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import GameUploadPage from "./pages/GameUploadPage";
import DeleteAccount from "./components/DeleteAccount";

function App() {
  console.log(Router);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/my" element={<MyPage/>} />
        <Route path="/search/:query" element={<SearchPage/>} />
        <Route path="edit" element={<EditProfilePage />}/>
        <Route path="submit" element={<GameUploadPage />}/>
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;