import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/pages/PaymentSuccessPage.css";
import NavbarSearch from "../components/layout/NavbarSearch";

const FailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    return (
    <>
        <NavbarSearch />
        <div className="payment-result-container">
        <div id="info" className="box_section" style={{ width: "600px" }}>
            <img width="100px" src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png" alt="에러 이미지" />
            <h2>결제를 실패했어요</h2>

            <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
                <div className="p-grid-col text--left">
                    <b>에러메시지</b>
                </div>
                <div className="p-grid-col text--right" id="message">{`${searchParams.get("message")}`}</div>
            </div>
            <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
                <div className="p-grid-col text--left">
                    <b>에러코드</b>
                </div>
                <div className="p-grid-col text--right" id="code">{`${searchParams.get("code")}`}</div>
            </div>

            <div className="p-grid-col">
                <button className="button p-grid-col5" onClick={()=>navigate("/")}>메인 페이지로 돌아가기</button>
                <button className="button p-grid-col5" onClick={()=>navigate("/my")}>결제 내역 확인하기</button>
            </div>
        </div>
        </div>
    </>
    );
}

export default FailPage;
