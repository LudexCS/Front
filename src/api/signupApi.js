import axios from "axios";

const BASE_URL = "http://16.184.9.194:30300/api";

// 닉네임 중복 체크
export const checkNickname = async (nickname) => {
  const res = await axios.post(`${BASE_URL}/validation/nickname`, { nickname });
  return res.data;
};

// 이메일 중복 체크
export const checkEmail = async (email) => {
  const res = await axios.post(`${BASE_URL}/validation/email`, { email });
  return res.data;
};

// 인증 이메일 발송
export const sendVerificationCode = async (email) => {
  const res = await axios.post(`${BASE_URL}/register/request`, { email });
  return res.data;
};

// 인증 코드 검증
export const verifyEmailCode = async (email, code) => {
  const res = await axios.post(`${BASE_URL}/register/verify`, { email, code });
  return res.data;
};

// 회원가입 요청
export const signupUser = async ({ nickname, email, password, repeatPassword }) => {
  console.log({ nickname, email, password, repeatPassword });
  const res = await axios.post(`${BASE_URL}/register/signup`, {
    nickname,
    email,
    password,
    repeatPassword,
  });
  return res.data;
};