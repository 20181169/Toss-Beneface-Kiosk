import apiClient from "./apiClient";
import { handleAuthError } from "../utils/errorHandler";

// 로그아웃 API 호출
export const logout = async (navigate) => {
    try {
        // 서버로 로그아웃 요청
        await apiClient.post("/logout");
    } catch (error) {
        // 전역 에러 처리 함수 호출
        handleAuthError(error, navigate, "로그아웃 요청 중 오류 발생:");
        throw error; // 필요 시 에러를 상위로 전달
    }
};
