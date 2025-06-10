import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { logout } from "../../api/userApi";
import { getWholePending, postPendingProfit } from "../../api/walletAuth";
import "../../styles/layout/Navbar.css";

const NavbarManage = () => {
  const { setIsLoggedIn } = useUser();
  const navigate = useNavigate();

  const tryPayout = async () => {
    try {
      const response = await getWholePending();
      if(response !== "0"){
        await postPendingProfit();
        alert(`총 ${response}원 정산되었습니다.`);
      } else {
        alert("미정산 금액이 0원 입니다.");
      }
    } catch (error) {
      console.error("정산 실패:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={()=>navigate("/manage-users")}>LUDEX</div>
      <div className="nav-links">
        <button className="manage-payout" onClick={tryPayout}>Payout</button>
        <Link to="/" onClick={()=>{
          logout(setIsLoggedIn);
          navigate("/login");
        }}>Logout</Link>
      </div>
    </nav>
  );
};

export default NavbarManage;