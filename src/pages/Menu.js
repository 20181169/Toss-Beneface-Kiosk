import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 가격 문자열("5,000원")을 숫자(5000)로 변환하는 헬퍼 함수
const parsePrice = (priceString) => {
  return Number(priceString.replace(/,/g, "").replace(/원/g, "").trim());
};

const StarbucksMenuPage = () => {
  const [currentTab, setCurrentTab] = useState("추천메뉴");
  const [recommendedMenu, setRecommendedMenu] = useState([]);
  const [isToggleOn, setIsToggleOn] = useState(false);
  // 선택한 메뉴(주문) 목록: { name, price (숫자), count } 형태
  const [selectedItems, setSelectedItems] = useState([]);
  // orderMenu가 자동 클릭되었는지 확인 (한번만 실행)
  const [orderMenuClicked, setOrderMenuClicked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 하드코딩 메뉴 데이터 (추천메뉴 제외)
  const staticMenuItems = {
    요거트: [
      {
        img: "/StarbucksMenu/starbucks14.jpg",
        name: "블루베리요거트",
        price: "5,000원",
        badge: "new",
      },
      { img: "/StarbucksMenu/starbucks15.jpg", name: "플레인요거트", price: "5,000원" },
      { img: "/StarbucksMenu/starbucks16.jpg", name: "요거트아이스라떼", price: "5,500원" },
      { img: "/StarbucksMenu/starbucks17.jpg", name: "딸기요거트", price: "5,200원" },
      { img: "/StarbucksMenu/starbucks18.jpg", name: "망고요거트", price: "5,300원" },
    ],
    커피: [
      { img: "/StarbucksMenu/starbucks11.jpg", name: "바나나라떼", price: "3,000원" },
      { img: "/StarbucksMenu/starbucks12.jpg", name: "카라멜라떼", price: "4,000원" },
    ],
    과일주스: [
      { img: "/StarbucksMenu/starbucks13.jpg", name: "자몽에이드", price: "4,500원" },
    ],
    티: [
      { img: "/StarbucksMenu/starbucks16.jpg", name: "그린티라떼", price: "5,000원" },
    ],
  };

  // 추천메뉴 API 호출
  useEffect(() => {
    const fetchRecommendedMenu = async () => {
      const matchedBrand = sessionStorage.getItem("matchedBrand");
      try {
        const response = await fetch(
          `https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/products/getmenu?brand=${encodeURIComponent(matchedBrand)}`
        );
        if (!response.ok) {
          throw new Error("네트워크 응답이 정상적이지 않습니다.");
        }
        const data = await response.json();
        // 받아온 메뉴 배열을 상태에 저장
        setRecommendedMenu(data.menus || []);
      } catch (error) {
        console.error("메뉴 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchRecommendedMenu();
  }, []);

  // API에서 받아온 추천메뉴를 매핑 (추천메뉴 탭용)
  const recommendedMenuCards = recommendedMenu.map((item) => {
    return {
      img: item.img,
      name: item.menu,
      price: item.price ? `${item.price}원` : "",
      stock: item.stock ?? 0,
      badge: "", // API에 배지 정보가 없으므로 빈값 처리
    };
  });

  // 메뉴 카드 클릭 시: 주문 수량을 입력받아 주문 목록에 추가
  // auto 파라미터가 true이면 사용자 입력 없이 수량 1로 추가
  const handleItemClick = (item, auto = false) => {
    let quantity;
    if (auto) {
      quantity = 1;
    } else {
      const input = window.prompt(`"${item.name}" 몇 개를 주문하시겠습니까?`, "1");
      if (input === null) return;
      quantity = parseInt(input, 10);
      if (isNaN(quantity) || quantity <= 0) {
        alert("유효한 주문 수량을 입력해주세요.");
        return;
      }
    }

    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((order) => order.name === item.name);
      if (existingItem) {
        return prevItems.map((order) =>
          order.name === item.name ? { ...order, count: order.count + quantity } : order
        );
      } else {
        return [...prevItems, { name: item.name, price: parsePrice(item.price), count: quantity }];
      }
    });
  };

  // 만약 location.state에 orderMenu가 전달되었다면 자동으로 주문내역에 추가 (단, 한번만 실행)
  useEffect(() => {
    if (location.state && location.state.menu && !orderMenuClicked) {
      const incomingMenu = location.state.menu;

      // 먼저 추천메뉴에서 찾고, 없으면 staticMenuItems에서 찾습니다.
      let itemFound =
        recommendedMenuCards.find(
          (item) => item.name.toLowerCase() === incomingMenu.toLowerCase()
        ) || null;
      if (!itemFound) {
        Object.values(staticMenuItems).forEach((menuArray) => {
          if (!itemFound) {
            const found = menuArray.find(
              (item) => item.name.toLowerCase() === incomingMenu.toLowerCase()
            );
            if (found) itemFound = found;
          }
        });
      }
      // 만약 찾았다면 자동 클릭 처리 (수량 1로 추가)
      if (itemFound) {
        handleItemClick(itemFound, true);
        setOrderMenuClicked(true);
      }
    }
  }, [location.state, recommendedMenuCards, orderMenuClicked, staticMenuItems]);

  // 결제 버튼 클릭 시
  const handleCheckout = () => {
    navigate("/faceRecognition");
  };

  // 음성결제 버튼 클릭 시
  const handleVoicePayment = () => {
    navigate("/voiceorder");
  };

  // Toggle 버튼 (오너 페이지 이동)
  const toggleMenu = () => {
    setIsToggleOn(!isToggleOn);
    navigate("/OwnerPage");
  };

  // 탭 목록
  const tabs = ["추천메뉴", "요거트", "커피", "과일주스", "티"];

  // 현재 탭에 표시할 데이터 결정
  let displayItems = [];
  if (currentTab === "추천메뉴") {
    displayItems = recommendedMenuCards;
  } else {
    displayItems = staticMenuItems[currentTab] || [];
  }

  // 주문 내역에서 특정 메뉴를 취소하는 기능
  const handleCancelOrder = (name) => {
    setSelectedItems((prevItems) => prevItems.filter((order) => order.name !== name));
  };

  // 총 주문 금액 계산
  const totalAmount = selectedItems.reduce(
    (total, order) => total + order.price * order.count,
    0
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* 왼쪽 패널: 메뉴 페이지 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 20px",
            backgroundColor: "#fff",
            boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
            alignItems: "center",
          }}
        >
          <div
            onClick={toggleMenu}
            style={{
              display: "flex",
              alignItems: "center",
              width: "50px",
              height: "25px",
              backgroundColor: isToggleOn ? "#4caf50" : "#ccc",
              borderRadius: "15px",
              position: "relative",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#fff",
                borderRadius: "50%",
                position: "absolute",
                top: "2.5px",
                left: isToggleOn ? "25px" : "2.5px",
                transition: "left 0.3s",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>{currentTab}</div>
          <div style={{ fontSize: "20px", cursor: "pointer" }}>⟳</div>
        </div>

        {/* 상단 배지 영역 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "#fff",
            borderBottom: "1px solid #ddd",
            padding: "10px 0",
          }}
        >
          <span style={{ fontSize: "14px", color: "#007bff", fontWeight: "bold" }}>
            인기
          </span>
          <span style={{ fontSize: "14px", color: "#ff4d4d", fontWeight: "bold" }}>
            신규
          </span>
        </div>

        {/* 탭 내비게이션 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            backgroundColor: "#fff",
            borderBottom: "1px solid #ddd",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              style={{
                ...tabButtonStyle,
                borderBottom:
                  currentTab === tab ? "2px solid #007bff" : "2px solid transparent",
              }}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 메뉴 카드 그리드 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {displayItems.map((item, index) => {
              const isOutOfStock = item.stock === 0;
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!isOutOfStock) handleItemClick(item);
                  }}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    textAlign: "center",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    opacity: isOutOfStock ? 0.5 : 1,
                    pointerEvents: isOutOfStock ? "none" : "auto",
                    cursor: "pointer",
                    transition: "border 0.3s",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  {/* 배지(인기/신규) 표시 */}
                  {item.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#fff",
                        borderRadius: "12px",
                        backgroundColor:
                          item.badge === "popular" ? "#007bff" : "#ff4d4d",
                      }}
                    >
                      {item.badge === "popular" ? "인기" : "신규"}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "10px",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginBottom: "5px",
                        wordBreak: "break-word",
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        textAlign: "center",
                      }}
                    >
                      {item.price}
                    </div>
                    {isOutOfStock && (
                      <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                        품절
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer - 결제하기 & 음성결제 버튼 */}
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff",
            borderTop: "1px solid #ddd",
            boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={handleCheckout}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            결제하기
          </button>
          <button
            onClick={handleVoicePayment}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: "#28a745",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            음성결제
          </button>
        </div>
      </div>

      {/* 오른쪽 패널: 주문내역 및 총 금액 */}
      <div
        style={{
          width: "300px",
          borderLeft: "1px solid #ddd",
          padding: "20px",
          backgroundColor: "#fefefe",
          overflowY: "auto",
        }}
      >
        <h2 style={{ borderBottom: "2px solid #007bff", paddingBottom: "10px", marginBottom: "20px" }}>
          주문내역
        </h2>
        {selectedItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>메뉴를 선택해주세요.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selectedItems.map((order, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold" }}>{order.name}</span>
                  <button
                    onClick={() => handleCancelOrder(order.name)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4d4d",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                </div>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  {order.count}개 &nbsp;&nbsp; | &nbsp;&nbsp; {order.price * order.count}원
                </div>
              </li>
            ))}
          </ul>
        )}
        <hr style={{ margin: "20px 0" }} />
        <h2 style={{ textAlign: "center", color: "#333" }}>총 금액</h2>
        <p style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", color: "#007bff" }}>
          {totalAmount}원
        </p>
      </div>
    </div>
  );
};

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