import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VisitStore() {
    const navigate = useNavigate();
    const location = useLocation();
    const { brand } = location.state || { brand: "매장" }; // 기본값 설정

    const [animationState, setAnimationState] = useState("enter"); // 애니메이션 상태 관리

    useEffect(() => {
        // 2초 후 조건에 따라 FaceRecognition으로 이동
        const timer = setTimeout(() => {
            setAnimationState("exit"); // 애니메이션 종료 상태로 변경
            setTimeout(() => {
                // FaceRecognition으로 brand 전달
                navigate('/faceRecognition', { state: { brand } });
            }, 1000); // 애니메이션 종료 시간(1초) 이후 페이지 이동
        }, 2000);

        return () => clearTimeout(timer); // 컴포넌트가 언마운트되면 타이머 제거
    }, [navigate, brand]);

    return (
        <>
            {/* CSS 추가 */}
            <style>
                {`
                    .visit-store-container {
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity 1s ease, transform 1s ease;
                    }

                    .visit-store-container.enter {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .visit-store-container.exit {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                `}
            </style>

            <div
                className={`visit-store-container ${animationState}`}
                style={{
                    margin: 0,
                    padding: 0,
                    fontFamily: "Arial, sans-serif",
                    background: "linear-gradient(to bottom, #e7f5fc, #ffffff)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <div
                    className="header"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 20px",
                    }}
                >
                    <div
                        className="back-button"
                        style={{ fontSize: "20px", cursor: "pointer" }}
                    >
                        ←
                    </div>
                </div>

                <div
                    className="cat-container"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        flex: 1,
                    }}
                >
                    <img
                        src="./starbucksLogo.png"
                        alt="store_image"
                        style={{
                            width: "150px",
                            height: "auto",
                            maxWidth: "100%",
                        }}
                    />
                    <p
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#333",
                            marginTop: "10px",
                        }}
                    >
                        {brand} 매장을 방문하셨어요
                    </p>
                </div>

                <div
                    className="message-container"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        padding: "15px",
                        margin: "20px",
                        width: "90%",
                        maxWidth: "400px",
                        textAlign: "center",
                    }}
                >
                    <div
                        className="message-text"
                        style={{
                            fontSize: "16px",
                            color: "#333",
                            lineHeight: "1.5",
                        }}
                    >
                        해당 매장은{" "}
                        <span
                            style={{
                                color: "#007bff",
                                fontWeight: "bold",
                            }}
                        >
                            키오스크가 있는{" "}
                        </span>
                        매장이에요.
                    </div>
                </div>

                <div
                    className="footer"
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px",
                    }}
                ></div>
            </div>
        </>
    );
}

export default VisitStore;