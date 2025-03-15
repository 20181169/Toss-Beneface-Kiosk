import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPayment } from "../api/paymentApi"; // ✅ API 함수 불러오기

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);

  // useRef는 useEffect 외부에서 선언
  const hasRun = useRef(false);

  useEffect(() => {
    async function handlePayment() {
      if (hasRun.current) return; // 이미 실행된 경우 종료
      hasRun.current = true; // 실행 여부 체크

      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const paymentKey = searchParams.get("paymentKey");

      // 필수 파라미터 체크
      if (!orderId || !amount || !paymentKey) {
        console.error("❌ 결제 정보가 부족합니다.");
        return;
      }

      const requestData = { orderId, amount, paymentKey };
  
      console.log("📤 Sending requestData:", requestData);
  
      try {
        const data = await confirmPayment(requestData, navigate);
        setResponseData(data);
      } catch (error) {
        console.error("❌ Payment error:", error.response?.data);
        navigate(`/fail?code=${error.response?.data?.code || "unknown"}&message=${error.response?.data?.message || "오류 발생"}`);
      }
    }
  
    handlePayment();
  }, [searchParams, navigate]);

  return (
    <>
      <div className="box_section" style={{ width: "600px" }}>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="결제 성공" style={{ display: "block", margin: "0 auto" }} />
        <h2>결제를 완료했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {searchParams.get("orderId")}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
            {searchParams.get("paymentKey")}
          </div>
        </div>
        <div className="p-grid-col">
          <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button className="button p-grid-col5" style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}>
              실시간 문의
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccessPage;
