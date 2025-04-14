import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from "./pages/MyPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import GameUploadPage from "./pages/GameUploadPage";
import DeleteAccount from "./components/modals/DeleteAccount";
import ManageUsersPage from "./pages/ManageUsersPage";
import GameDetailPage from "./pages/GameDetailPage";

function App() {
  console.log(Router);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path="/my" element={<MyPage/>} />
        <Route path="/search/:query" element={<SearchPage/>} />
        <Route path="/edit-profile" element={<EditProfilePage />}/>
        <Route path="/submit-game" element={<GameUploadPage />}/>
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/manage-users" element={<ManageUsersPage />} />
        <Route path="/game/:gameId" element={<GameDetailPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;