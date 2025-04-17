import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getNewAccessToken } from "../api/auth";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = async () => {
    try {
      await axiosInstance.delete("/auth/logout");
    } catch (e) {
      console.error("서버 로그아웃 실패", e);
    } finally {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const data = await getNewAccessToken();
      localStorage.setItem("accessToken", data.accessToken);
      setIsLoggedIn(true);
      return data.accessToken;
    } catch (err) {
      logout();
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshAccessToken().catch(() => logout());
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);