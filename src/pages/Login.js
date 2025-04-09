import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext"; // ✅ 전역 상태 사용
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // ✅ 전역 로그인 상태 setter 사용
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(id, password);
      
      // access token 저장
      localStorage.setItem("accessToken", data.accessToken);

      // 전역 로그인 상태 업데이트
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      setError("로그인 실패. 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          <h2>로그인</h2>
          <input
            type="text"
            placeholder="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p className="error">{error}</p>}
          <p>
            If you don’t have an account:{" "}
            <span className="signup-link" onClick={() => navigate("/signup")}>
              sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import "./Login.css";

// const Login = ({ setIsLoggedIn }) => {
//   const navigate = useNavigate();
//   const [id, setId] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     alert("로그인 성공!");
//     setIsLoggedIn(true);
//     navigate("/");
//   };

//   return (
//     <div>
//     <Navbar/>
//     <div className="login-container">
//       <div className="login-content">
//       <h2>로그인</h2>
//       <input type="text" placeholder="id" value={id} onChange={(e) => setId(e.target.value)} />
//       <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//       <p>
//         If you don’t have an account:{" "}
//         <span className="signup-link" onClick={() => navigate("/signup")}>
//           sign up
//         </span>
//       </p>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Login;