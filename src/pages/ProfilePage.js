import React from "react";
import { useLocation } from "react-router-dom"; // 로그인 성공 시 전달된 state 사용

const ProfilePage = () => {
    const location = useLocation();
    const { memberId, email, memberName, phoneNumber, gender, role } = location.state;

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
            <h1 style={{ color: "#007bff", fontWeight: "bold" }}>회원 정보</h1>
            <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                width: "90%",
                maxWidth: "400px",
                textAlign: "left",
            }}>
                <p><strong>회원 ID:</strong> {memberId}</p>
                <p><strong>이메일:</strong> {email}</p>
                <p><strong>이름:</strong> {memberName}</p>
                <p><strong>전화번호:</strong> {phoneNumber}</p>
                <p><strong>성별:</strong> {gender}</p>
                <p><strong>역할:</strong> {role}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
