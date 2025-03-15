import React, { useState } from "react";

const StarbucksMenuPage = () => {
    // 현재 선택된 탭 상태 관리
    const [currentTab, setCurrentTab] = useState("추천메뉴");

    // 전체 메뉴 데이터
    const menuItems = {
        추천메뉴: [
            { img: "/twosomeMenu/twosome1.jpg", name: "바나나라떼", price: "3,000원", badge: "popular" },
            { img: "/twosomeMenu/twosome2.jpg", name: "카라멜라떼", price: "4,000원" },
            { img: "/twosomeMenu/twosome3.jpg", name: "자몽에이드", price: "4,500원" },
        ],
        요거트: [
            { img: "/twosomeMenu/twosome4.jpg", name: "블루베리요거트", price: "5,000원", badge: "new" },
            { img: "/twosomeMenu/twosome5.jpg", name: "플레인요거트", price: "5,000원" },
            { img: "/twosomeMenu/twosome6.jpg", name: "요거트아이스라떼", price: "5,500원" },
        ],
        커피: [
            { img: "/twosomeMenu/twosome1.jpg", name: "바나나라떼", price: "3,000원" },
            { img: "/twosomeMenu/twosome2.jpg", name: "카라멜라떼", price: "4,000원" },
        ],
        과일주스: [
            { img: "/twosomeMenu/twosome3.jpg", name: "자몽에이드", price: "4,500원" },
        ],
        티: [
            { img: "/twosomeMenu/twosome4.jpg", name: "그린티라떼", price: "5,000원" },
        ],
    };

    // 결제 버튼 클릭 시 실행할 함수
    const handleCheckout = () => {
        alert("결제하기 페이지로 이동합니다!");
        // 결제 페이지 이동 로직 추가 가능
    };

    return (
        <div style={{
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            height: "100vh"
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 20px",
                backgroundColor: "#fff",
                boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)"
            }}>
                <div style={{ fontSize: "20px", cursor: "pointer" }}>←</div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>{currentTab}</div>
                <div style={{ fontSize: "20px", cursor: "pointer" }}>⟳</div>
            </div>

            {/* Menu Tabs */}
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                backgroundColor: "#fff",
                borderBottom: "1px solid #ddd"
            }}>
                {Object.keys(menuItems).map((tab) => (
                    <button
                        key={tab}
                        style={{
                            ...tabButtonStyle,
                            borderBottom: currentTab === tab ? "2px solid #007bff" : "2px solid transparent",
                        }}
                        onClick={() => setCurrentTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Menu Grid with Scrollbar */}
            <div style={{
                flex: 1,
                overflowY: "auto", // 스크롤바 활성화
                padding: "20px",
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "15px",
                }}>
                    {menuItems[currentTab]?.map((item, index) => (
                        <div key={index} style={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
                            overflow: "hidden",
                            textAlign: "center",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column", // 이미지, 이름, 가격을 세로로 배치
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                            {/* 이미지 */}
                            <img
                                src={item.img}
                                alt={item.name}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    objectFit: "cover", // 이미지 크기를 고정
                                }}
                            />
                            {/* 인기/신규 배지 */}
                            {item.badge && (
                                <div style={{
                                    position: "absolute",
                                    top: "10px",
                                    left: "10px",
                                    padding: "5px 10px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    backgroundColor: item.badge === "popular" ? "#007bff" : "#ff4d4d",
                                }}>
                                    {item.badge === "popular" ? "인기" : "신규"}
                                </div>
                            )}
                            {/* 음식명 및 가격 */}
                            <div style={{
                                padding: "10px",
                                flexGrow: 1, // 텍스트 영역의 크기를 늘려 반응형으로 유지
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <div style={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                    wordBreak: "break-word", // 텍스트 줄바꿈 처리
                                    textAlign: "center",
                                }}>
                                    {item.name}
                                </div>
                                <div style={{
                                    fontSize: "12px",
                                    color: "#555",
                                    textAlign: "center",
                                }}>
                                    {item.price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer - 결제하기 버튼 */}
            <div style={{
                padding: "15px",
                backgroundColor: "#fff",
                borderTop: "1px solid #ddd",
                boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
                textAlign: "center"
            }}>
                <button onClick={handleCheckout} style={{
                    padding: "15px 30px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundColor: "#007bff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}>
                    결제하기
                </button>
            </div>
        </div>
    );
};

// Tab Button Style
const tabButtonStyle = {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    color: "#333",
    border: "none",
    background: "none",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
};

export default StarbucksMenuPage;