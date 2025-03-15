import apiClient from "./apiClient";
import { handleAuthError } from "../utils/errorHandler";

export const confirmPayment = async (requestDto, navigate) => {
    try {
        console.log("📌 confirmPayment 요청 데이터:", requestDto); // ✅ 추가

        // 🔹 API 요청 (apiClient가 자동으로 토큰 포함)
        const response = await apiClient.post("/payment/confirm/payment", requestDto);

        console.log("✅ confirmPayment 응답:", response.data);
        return response.data;
    } catch (error) {
        console.error("🚨 confirmPayment 오류:", error.response?.data || error.message); // ✅ 추가
        handleAuthError(error, navigate, "결제 확인 API 호출 중 오류 발생:");
        throw error;
    }
};
