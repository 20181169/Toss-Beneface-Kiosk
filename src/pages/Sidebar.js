import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [hoverIndex, setHoverIndex] = useState(null); // Track hovered item index


    const menuItems = [
        // { label: "주문 홈", icon: "📦", route: "/" },
        // { label: "매출 리포트", icon: "📊", route: "/sales-report" },
        // { label: "상품 관리", icon: "📦", route: "/product-management" },
        // { label: "상권분석", icon: "🎟️", route: "/market-analysis" }, // Ensure this route is correct
        { label: "상권분석-Beta", icon: "🎟️", route: "/market-analysis-beta" },
        // { label: "키오스크", icon: "💻", route: "/kiosk" },
        // { label: "리뷰 관리", icon: "⭐", badge: "beta", route: "/review-management" },
        { label: "QnA", icon: "🔔", route: "/qna" },
        // { label: "사장님 혜택", icon: "🎁", badge: "이벤트 오픈", route: "/owner-benefits" },
        // { label: "설정", icon: "⚙️", route: "/settings" },
        // { label: "고객센터 문의하기", icon: "❓", route: "/support" },
    ];

    const handleNavigation = (route) => {
        if (route) navigate(route); // Navigate to the specified route
    };

    return (
        <div style={sidebarStyle}>
            <h3 style={sidebarTitleStyle}>사이드바 메뉴</h3>
            <ul style={menuStyle}>
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            ...menuItemStyle,
                            ...(hoverIndex === index ? menuItemHoverStyle : {}), // Hover 시 스타일 적용
                        }}
                        onClick={() => handleNavigation(item.route)} // Add click handler
                        onMouseEnter={() => setHoverIndex(index)} // Set hover index on mouse enter
                        onMouseLeave={() => setHoverIndex(null)} // Reset on mouse leave
                    >
                        <span style={iconStyle}>{item.icon}</span>
                        <span style={labelStyle}>{item.label}</span>
                        {item.badge && (
                            <span
                                style={{
                                    ...badgeStyle,
                                    backgroundColor: item.badge === "beta" ? "#ccc" : "#f05d5d",
                                }}
                            >
                                {item.badge}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Styles
const sidebarStyle = {
    width: "250px",
    backgroundColor: "#f9f9f9",
    borderRight: "1px solid #ddd",
    padding: "20px",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
};

const sidebarTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
};

const menuStyle = {
    listStyle: "none",
    padding: "0",
};

const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s",
};

menuItemStyle["&:hover"] = {
    backgroundColor: "#eaeaea",
};

const iconStyle = {
    marginRight: "10px",
    fontSize: "18px",
};

const labelStyle = {
    flex: 1,
    fontSize: "16px",
    fontWeight: "500",
};

const badgeStyle = {
    fontSize: "12px",
    padding: "5px 8px",
    borderRadius: "12px",
    color: "#fff",
};
const menuItemHoverStyle = {
    backgroundColor: "#eaeaea",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-2px)",
};
export default Sidebar;