import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import { clearAccessToken } from "../redux/auth/authSlice";
import { buttonStyle } from "../styles/buttonStyle";
import { logout } from "../api/logoutApi";
import { handleAuthError } from "../utils/errorHandler";

const LogoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 로그아웃 API 호출 (navigate 전달)
            await logout(navigate);

            // Redux에서 accessToken 삭제
            dispatch(clearAccessToken());
            
            // 로그아웃 완료 메시지
            alert("로그아웃 되었습니다.");

            // 로그아웃 후 로그인 페이지로 이동
            navigate("/login");
        } catch (error) {
            // handleAuthError를 사용하여 실패 처리
            handleAuthError(error, navigate, "로그아웃 요청 실패:");
        }

    };

    return (
        <div style={{
            fontFamily: "Arial, sans-serif",
            background: "linear-gradient(to bottom, #e7f5fc, #ffffff)",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <h1 style={{ color: "#007bff", fontWeight: "bold" }}>로그아웃</h1>
            <button onClick={handleLogout} style={buttonStyle}>
                로그아웃
            </button>
        </div>
    );
};

export default LogoutPage;
