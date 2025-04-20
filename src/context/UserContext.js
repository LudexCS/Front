import React, { createContext, useState, useEffect, useContext } from "react";
import { getUserData } from "../api/userApi";
import { useAuth } from "./AuthContext";  // AuthContext에서 로그인 상태 및 로그아웃 불러오기

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const { logout } = useAuth();  // 로그아웃 함수 연동
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 중 여부
  const [error, setError] = useState(null);      // 에러 상태

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();  // 토큰 없이 호출
        setUser(data);  // 유저 정보 저장
      } catch (err) {
        console.error("회원 정보 불러오기 실패:", err);
        setError(err);
        // logout();  // 유저 정보 불러오기 실패 시 로그아웃
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchUser();
  }, [logout]);  // logout 의존성 추가 (useCallback이므로 안전함)

  if (loading) return <div>회원 정보를 불러오는 중입니다...</div>;
  // if (error) return <div>회원 정보를 불러올 수 없습니다. 다시 로그인해주세요.</div>;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;