import axiosInstance from "./Instance/axiosInstance";
import axios from "axios";

export const loginUser = async (email, password) => {
  const response = await axios.post(
    "http://16.184.9.194:31219/useraccount/api/auth/login",
    { email, password },
    { withCredentials: true }    // refreshToken 쿠키 수신용
  );
  // 헤더에서 Bearer 토큰 파싱
  const authHeader = response.headers["authorization"];
  if (!authHeader) {
    throw new Error("로그인에 실패했습니다: 액세스 토큰이 없습니다.");
  }
  const accessToken = authHeader.split(" ")[1];
  console.log("accessToken: ", accessToken);
  return { accessToken };
};

export const logout = async (setIsLoggedIn) => {
  console.log("로그아웃");
  localStorage.removeItem("accessToken");
  setIsLoggedIn(false);
  // 캐시 관련
  // try {
  //   const response = await axios.delete("http://3.37.46.45:30300/api/auth/logout"
  //     ,{ withCredentials: true }
  //   );
  //   return response;
  // } catch (err) {
  //   const msg = err.response?.data?.message || err.message;
  //   console.log("logout 로그아웃 실패: ", msg);
  // }
};

// 회원 정보를 가져오는 API
export const getUserData = async () => {
  try {
    const response = await axiosInstance.get("/protected/account/get");
    console.log("getUserData response: ", response.data);
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.log("getUserData 회원 정보 get 실패: ", msg);
    throw err;
  }
};

export const getNewAccessToken = async () => {
  const response = await axiosInstance.get("/auth/reissue",
    { withCredentials: true } 
  );
  
  // 헤더에서 새 토큰 추출
  const authHeader = response.headers["authorization"];
  if (!authHeader) {
    throw new Error("액세스 토큰 재발급 실패");
  }
  const accessToken = authHeader.split(" ")[1];

  return { accessToken };
};