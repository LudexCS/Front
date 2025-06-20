import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import "../styles/pages/PaymentSuccessPage.css";
import {confirmPayment} from "../api/purchaseApi";
import NavbarSearch from "../components/layout/NavbarSearch";
import { useRecord } from "../context/RecordContext";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [responseData, setResponseData] = useState(null);
    const { setIsFetch, isFetch } = useRecord();

    useEffect(() => {
        async function confirm() {
            const requestData = {
                orderId: searchParams.get("orderId"),
                amount: searchParams.get("amount"),
                paymentKey: searchParams.get("paymentKey"),
                itemId: searchParams.get("itemId"),
                gameId: searchParams.get("gameId"),
                tokenAmount: searchParams.get("tokenAmount")
            };

            return await confirmPayment(requestData);
        }

        confirm()
            .then((data) => {
                setResponseData(data);
            })
            .catch((error) => {
                navigate(`/payment/fail?code=${error.code}&message=${error.message}`);
            });
        
        if(isFetch){
            setIsFetch(false);
        } else {
            setIsFetch(true);
        }
    }, [searchParams]);

    return (
    <>
        <NavbarSearch />
        <div className="payment-result-container">
            <div className="box_section" style={{ width: "600px" }}>
                <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
                <h2>결제를 완료했어요</h2>
                <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
                    <div className="p-grid-col text--left">
                        <b>결제금액</b>
                    </div>
                    <div className="p-grid-col text--right" id="amount">
                          {responseData &&
                            `${Number(searchParams.get("amount")).toLocaleString()}${responseData.currency === "USD" ? " USD" : "원"}`}
                    </div>
                </div>
                <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
                    <div className="p-grid-col text--left">
                        <b>주문번호</b>
                    </div>
                    <div className="p-grid-col text--right" id="orderId">
                        {`${searchParams.get("orderId")}`}
                    </div>
                </div>
                <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
                    <div className="p-grid-col text--left">
                        <b>paymentKey</b>
                    </div>
                    <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
                        {`${searchParams.get("paymentKey")}`}
                    </div>
                </div>
                <div className="p-grid-col">
                    <button className="button p-grid-col5" onClick={()=>{navigate(-1)}}>상세 페이지로 돌아가기</button>
                    <button className="button p-grid-col5" onClick={()=>{navigate("/my")}}>결제 내역 확인하기</button>
                </div>
            </div>
        </div>
    </>
    );
}

export default PaymentSuccessPage;