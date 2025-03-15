// src/redux/auth/authActions.js
import { clearAccessToken } from "../auth/authSlice";
import { logout } from "../../api/logoutApi"; // 로그아웃 API 호출

export const handleLogout = () => async (dispatch) => {
    try {
        // 서버에 로그아웃 요청
        await logout();

        // Redux 상태 초기화
        dispatch(clearAccessToken());

        // 브라우저 쿠키 제거 (예: 세션 쿠키)
        document.cookie = "refreshToken=; Max-Age=0; path=/;";
    } catch (error) {
        console.error("로그아웃 처리 중 오류 발생:", error);
    }
};
