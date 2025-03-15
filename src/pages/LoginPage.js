import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux/auth/authSlice";
import { login } from "../api/authApi";
import { buttonStyle } from "../styles/buttonStyle";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 보기 상태

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData); // 로그인 요청
            const { accessToken } = response || {};
            if (!accessToken) {
                throw new Error("accessToken을 가져오지 못했습니다.");
            }
            dispatch(setAccessToken(accessToken));

            console.log("로그인 응답:", response);
            navigate("/");
        } catch (error) {
            console.error("로그인 에러:", error);
            const errorMessage = error.response?.data?.message || "로그인 실패. 다시 시도해주세요.";
            alert(errorMessage);
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
            <h1 style={{
                color: "#007bff",
                fontWeight: "bold",
                fontSize: "36px",
                marginBottom: "30px",
            }}>
                로그인
            </h1>
            <form onSubmit={handleSubmit} style={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                maxWidth: "400px",
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}>
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                        marginBottom: "15px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                    }}
                />
                {/* 비밀번호 입력창 */}
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            paddingRight: "50px", // 버튼 공간 확보
                        }}
                    />
                    {/* 보기/숨기기 버튼 */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            color: "#007bff",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        {showPassword ? "숨기기" : "보기"}
                    </button>
                </div>
                <button type="submit" style={buttonStyle}>로그인</button>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "15px",
                }}>
                    <button
                        type="button"
                        onClick={() => navigate("/join")}
                        style={{
                            ...buttonStyle,
                            flex: 1,
                            backgroundColor: "#e1eaf0",
                            color: "#007bff",
                        }}
                    >
                        회원가입
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        style={{
                            ...buttonStyle,
                            flex: 1,
                            backgroundColor: "#e1eaf0",
                            color: "#007bff",
                        }}
                    >
                        홈 화면으로
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
