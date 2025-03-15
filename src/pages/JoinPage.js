import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { join, login } from "../api/authApi";
import { setAccessToken } from "../redux/auth/authSlice";
import { buttonStyle } from "../styles/buttonStyle";
import { dropdownStyle } from "../styles/dropdownStyle";

const JoinPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        memberName: "",
        phoneNumber: "",
        gender: "male",
        role: "user",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const joinResponse = await join(formData);

            alert(`회원가입 성공: ${joinResponse.memberName}`);

            const loginResponse = await login({
                email: formData.email,
                password: formData.password,
            });

            dispatch(setAccessToken(loginResponse.accessToken));
            Cookies.set("refreshToken", loginResponse.refreshToken, { expires: 7, secure: true });

            alert("회원가입 및 로그인 성공!");
            navigate("/profile", { state: loginResponse });
        } catch (error) {
            alert("회원가입 실패. 다시 시도해주세요.");
        }
    };

    const inputFields = [
        { name: "email", type: "email", placeholder: "이메일" },
        { name: "password", type: "password", placeholder: "비밀번호" },
        { name: "memberName", type: "text", placeholder: "이름" },
        { name: "phoneNumber", type: "text", placeholder: "휴대폰 번호" },
    ];

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
                회원가입
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
                {inputFields.map((field) => (
                    <input
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
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
                ))}
                <select name="gender" value={formData.gender} onChange={handleChange} style={dropdownStyle}>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
                <select name="role" value={formData.role} onChange={handleChange} style={dropdownStyle}>
                    <option value="user">일반 사용자</option>
                    <option value="owner">가게 주인</option>
                    <option value="admin">관리자</option>
                </select>
                <button type="submit" style={buttonStyle}>회원가입</button>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px", // 버튼 사이 간격 추가
                    marginTop: "15px",
                }}>
                    <button
                        type="button"
                        onClick={() => navigate("/login")} // 로그인 페이지로 이동
                        style={{
                            ...buttonStyle,
                            flex: 1, // 버튼 크기를 동일하게 맞춤
                            backgroundColor: "#d9effc", 
                            color: "#0056b3", 
                        }}
                    >
                        로그인
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/")} // 홈 화면으로 이동
                        style={{
                            ...buttonStyle,
                            flex: 1, // 버튼 크기를 동일하게 맞춤
                            backgroundColor: "#d9effc", 
                            color: "#0056b3", // 텍스트 색상
                        }}
                    >
                        홈 화면으로
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JoinPage;
