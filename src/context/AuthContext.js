// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getNewAccessToken } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  const refreshAccessToken = async () => {
    try {
      const data = await getNewAccessToken();
      localStorage.setItem("accessToken", data.accessToken);
      setIsLoggedIn(true);
      return data.accessToken;
    } catch (err) {
      logout();
      throw err;
    }
  };

  useEffect(() => {
    // 자동 로그인 시도
    refreshAccessToken().catch(() => logout());
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);