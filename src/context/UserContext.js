import React, { createContext, useState, useEffect, useContext } from "react";
import { logout, getUserData } from "../api/userApi";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFetch, setIsFetch] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUser(data);  // 유저 정보 저장
      } catch (err) {
        console.log("useContext 회원 정보 불러오기 실패:", err);
        logout(setIsLoggedIn);
      }
    };
    fetchUser();
  }, [isLoggedIn, isFetch]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, isFetch, setIsFetch }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);

export default UserProvider;