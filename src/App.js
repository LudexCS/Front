import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from "./pages/MyPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import GameUploadPage from "./pages/GameUploadPage";
import DeleteAccount from "./components/modals/DeleteAccount";
import ManageUsersPage from "./pages/ManageUsersPage";
import ManageContentPage from "./pages/ManageContentPage";
import ManageReportPage from "./pages/ManageReportPage";
import GameDetailPage from "./pages/GameDetailPage";
import UserProvider from './context/UserContext';
import { UploadProvider } from "./context/UploadContext";
import { RecordProvider } from "./context/RecordContext";
import { GameProvider } from "./context/gameContext";
import ConfigProvider from "./context/ConfigContext";
import GameEditPage from "./pages/GameEditPage";

function App() {
  console.log(Router);

  return (
    <UserProvider>
      <ConfigProvider>
        <UploadProvider>
          <RecordProvider>
            <GameProvider>
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
                <Route path="/manage-content" element={<ManageContentPage />} />
                <Route path="/review-reports" element={<ManageReportPage />} />
                <Route path="/game/:gameId" element={<GameDetailPage />} />
                <Route path="/edit-game/:gameId" element={<GameEditPage />} />
              </Routes>
            </GameProvider>
          </RecordProvider>
        </UploadProvider>
      </ConfigProvider>
    </UserProvider>
  );
}

export default App;