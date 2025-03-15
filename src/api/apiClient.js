import axios from "axios";
import store from "../redux/store";
import { setAccessToken, clearAccessToken } from "../redux/auth/authSlice";
import { refreshAccessToken } from "../redux/auth/authSlice";

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: true, // 쿠키를 포함하여 요청
});

// 요청 인터셉터: AccessToken 추가
apiClient.interceptors.request.use(
    async (config) => {
        const state = store.getState();
        const accessToken = state.auth.accessToken;

        try {
            // AccessToken이 없는 경우 RefreshToken으로 갱신 시도
            if (!accessToken) {
                const result = await store.dispatch(refreshAccessToken());

                if (result.meta.requestStatus === "fulfilled") {
                    const newAccessToken = result.payload;
                    store.dispatch(setAccessToken(newAccessToken));
                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                } else {
                    // RefreshToken 갱신 실패
                    throw new Error("AccessToken 갱신 실패");
                }
            } else {
                // 기존 AccessToken 추가
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        } catch (error) {
            console.error("요청 인터셉터 중 오류:", error);
            throw error;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 토큰 만료 시 RefreshToken으로 재발급
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // RefreshToken을 사용해 새로운 AccessToken 요청
                const result = await store.dispatch(refreshAccessToken());

                if (result.meta.requestStatus === "fulfilled") {
                    // 새로운 AccessToken 저장
                    const newAccessToken = result.payload;
                    store.dispatch(setAccessToken(newAccessToken));

                    // 원래 요청 재시도
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest); // 자기자신(apiClient) 재호출
                } else {
                    // 갱신 실패 시 로그아웃 처리
                    throw new Error("AccessToken 및 RefreshToken 갱신 실패");
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);

                // 로그아웃 처리
                store.dispatch(clearAccessToken());
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
