import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// 회원가입 요청 추가
export const join = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/join`, data);
        return response.data; // 회원가입 응답 데이터 반환
    } catch (error) {
        console.error("회원가입 실패", error);
        throw error;
    }
};

// RefreshToken 요청 함수
export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/access-token/issue`,
            {}, // 요청 본문이 필요하지 않음
            {
                withCredentials: true, // 쿠키 포함
            }
        ).then((response) => {
            document.cookie = `refreshToken=${response.data.refreshToken}; HttpOnly;`;
        })
        .catch((error) => {
            console.error('Error refreshing token:', error);
        });;
        return response.data; // 새로운 AccessToken 반환
    } catch (error) {
        console.error("AccessToken 재발급 실패", error);
        throw error;
    }
};

// 로그인 요청
export const login = async (data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            data,
            { withCredentials: true } // 쿠키를 서버와 주고받기 위해 설정
        );

        // 응답 데이터 검사
        if (!response || !response.data) {
            throw new Error("서버로부터 응답이 올바르지 않습니다.");
        }

        const { accessToken, refreshToken } = response.data;

        // accessToken과 refreshToken이 모두 있어야 성공
        if (!accessToken || !refreshToken) {
            throw new Error("로그인 응답에 토큰이 포함되어 있지 않습니다.");
        }

        return response.data; // JWT 및 기타 데이터 반환
    } catch (error) {
        console.error("로그인 실패", error);

        // 사용자에게 적절한 에러 메시지 전달
        const errorMessage = error.response?.data?.message || "로그인 요청 중 오류가 발생했습니다.";
        throw new Error(errorMessage);
    }
};