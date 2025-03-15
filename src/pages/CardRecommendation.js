import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

// ----- 유틸 함수 및 스타일 정의 -----
const countBenefits = (benefits) => {
  if (Array.isArray(benefits)) {
    return benefits.length;
  } else if (typeof benefits === "string") {
    return benefits.split("\n").filter((line) => line.trim() !== "").length;
  }
  return 0;
};

const styles = {
  outerContainer: {
    overflow: "visible",
    padding: "20px",
  },
  container: {
    maxWidth: "1080px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    color: "#202632",
    fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  headerP: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#202632",
  },
  paymentButton: {
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#0064FF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  // 스크롤 가능한 래퍼 (부드러운 스크롤 효과 포함)
  cardListWrapper: {
    width: "940px",
    overflowX: "auto",
    scrollBehavior: "smooth",
    margin: "0 auto",
    padding: "0 20px",
    textAlign: "center",
    display: "flex",
    justifyContent: "flex-start",
    msOverflowStyle: "none", // IE 및 Edge
    scrollbarWidth: "none", // Firefox
    WebkitOverflowScrolling: "touch",
    scrollSnapType: "x mandatory",
    perspective: "1000px",
  },
  cardList: {
    display: "inline-flex",
    flexWrap: "nowrap",
    gap: "20px",
    paddingBottom: "20px",
    justifyContent: "center",
  },
  cardItem: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    overflow: "visible",
    width: "300px",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    transition:
      "transform 0.5s, box-shadow 0.2s, border 0.2s, filter 0.2s, opacity 0.2s",
    cursor: "pointer",
    scrollSnapAlign: "center",
    transformStyle: "preserve-3d",
  },
  cardImage: {
    width: "100%",
    height: "400px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  cardInfo: {
    padding: "15px",
    flexGrow: 1,
  },
  cardInfoH2: {
    fontSize: "20px",
    marginBottom: "8px",
    color: "#202632",
  },
  cardInfoP: {
    fontSize: "14px",
    lineHeight: 1.4,
    color: "#202632",
  },
  rankBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#0064FF",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "5px",
    fontSize: "18px",
    fontWeight: "bold",
    zIndex: 1,
  },
};

// ----- 개별 카드 컴포넌트 -----
// (예측 결과와 computedRank(순위)를 카드 정보 하단에 추가)
const Card = ({
  card,
  onSelect,
  distance,
  relativeIndex,
  isAutoSelected,
  isClicked,
}) => {
  const [hover, setHover] = useState(false);
  let cardItemStyle = { ...styles.cardItem };

  if (isAutoSelected) {
    cardItemStyle.transformOrigin = "top center";
    cardItemStyle.transform = "scale(1.1)";
    cardItemStyle.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
  } else {
    const scaleFactor = Math.max(0.7, 1 - 0.1 * distance);
    const angle = relativeIndex * 5;
    cardItemStyle.transform = `scale(${scaleFactor}) rotateY(${angle}deg)`;
    cardItemStyle.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  }

  cardItemStyle.border = isClicked ? "3px solid #0064FF" : "3px solid transparent";
  cardItemStyle.filter = "none";
  // 선택되지 않은 카드(자동 선택 및 클릭되지 않은 카드)는 opacity를 낮춤
  const isSelected = isAutoSelected || isClicked;
  cardItemStyle.opacity = isSelected ? 1 : 0.6;

  // benefits가 배열일 경우 join 처리, 문자열이면 그대로 사용
  const benefitsText =
    Array.isArray(card.benefits)
      ? card.benefits.join("\n")
      : typeof card.benefits === "string"
      ? card.benefits
      : "";

  return (
    <div
      style={cardItemStyle}
      onClick={() => onSelect(card)}
      onMouseEnter={() => {
        if (!isAutoSelected) setHover(true);
      }}
      onMouseLeave={() => {
        if (!isAutoSelected) setHover(false);
      }}
    >
      {/* computedRank를 보여줍니다. 예: "1", "2", "3", ... */}
      <div style={styles.rankBadge}>{card.computedRank}</div>
      <div
        style={{
          ...styles.cardImage,
          backgroundImage: `url(${card.image})`,
        }}
      ></div>
      <div style={styles.cardInfo}>
        <h2 style={styles.cardInfoH2}>{card.title}</h2>
        <p style={styles.cardInfoP}>
          {benefitsText.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
        {card.prediction !== null && (
          <div style={{ color: "#d63384", fontSize: "14px", marginTop: "5px" }}>
            예측 결과: {card.prediction}
          </div>
        )}
      </div>
    </div>
  );
};

// ----- 메인 카드 추천 컴포넌트 -----
// 기존 API 호출 로직 + 슬라이더 UI 적용
const CardRecommendation = () => {
  const [recommendedCards, setRecommendedCards] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const { state } = useLocation();
  const memberId = state?.memberId;

  // 선택된 카드로 결제 진행 버튼 클릭 시 호출되는 핸들러 (추후 결제 로직 추가)
  const handlePayment = () => {
    console.log("선택한 카드로 결제 진행:", clickedCard);
    // 여기서 결제 진행 로직 추가
  };

  // 예측 API를 호출하는 함수 (각 카드별로 index를 받아 predictions 배열의 해당 인덱스에 저장)
  const callPredictAPI = async (modelData, index) => {
    try {
      const response = await fetch("https://benefacefastapi20-frgtcya5bnefbdfs.koreacentral-01.azurewebsites.net/fastapi/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
      });
      if (!response.ok) {
        throw new Error("예측 API 호출에 실패했습니다.");
      }
      const data = await response.json();
      console.log("예측 결과:", data);
      setPredictions((prev) => {
        const newPredictions = [...prev];
        newPredictions[index] = data;
        return newPredictions;
      });
    } catch (error) {
      console.error("예측 API 호출 중 에러:", error);
    }
  };

  // 재무 데이터 및 카드 혜택 데이터를 불러와 각 카드별 model_data 생성 후 예측 API 호출
  useEffect(() => {
    if (memberId) {
      fetch(
        `https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/user-data-test/financial-data?memberId=${memberId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("재무 데이터 조회에 실패했습니다.");
          }
          return response.json();
        })
        .then((financialData) => {
          console.log("재무 데이터:", financialData);
          const benefitPromises = financialData.map(async (item, index) => {
            const params = new URLSearchParams({
              carcompany: item.corcompany,
              card_name: item.card,
            });
            const res = await fetch(
              `https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/card-benefits/get_details?${params.toString()}`
            );
            if (!res.ok) {
              throw new Error("카드 혜택 상세 조회에 실패했습니다.");
            }
            const benefitDataArray = await res.json();
            const benefitData = benefitDataArray[0]; // 응답이 배열이라고 가정

            // 모델 데이터 생성 (필드명은 FastAPI 모델과 일치)
            const model_data = {
              전월실적: item.last_per,
              결제금액: item.pay_amount,
              혜택받은횟수: item.monthly_split,
              이번달실적: item.now_per,
              혜택받은금액: item.Accrue_benefit,
              Benefit: benefitData.Benefit,
              limit_once: benefitData.limit_once,
              limit_month: benefitData.limit_month,
              min_pay: benefitData.min_pay,
              min_per: benefitData.min_per,
              monthly: benefitData.monthly,
            };

            console.log("생성된 model_data:", model_data);
            // 생성되는 즉시 예측 API 호출 (index를 전달하여 predictions 배열에 저장)
            callPredictAPI(model_data, index);

            // 카드와 혜택 데이터를 하나의 객체로 합쳐 반환
            return { ...item, ...benefitData, model_data };
          });

          Promise.all(benefitPromises)
            .then((cardsWithBenefits) => {
              console.log("카드와 혜택 데이터:", cardsWithBenefits);
              setRecommendedCards(cardsWithBenefits);
            })
            .catch((error) => {
              console.error("카드 혜택 조회 중 에러:", error);
            });
        })
        .catch((error) => {
          console.error("재무 데이터 조회 중 에러:", error);
        });
    }
  }, [memberId]);

  // 추천받은 카드 데이터를 슬라이더에 맞게 변환
  // 예측 결과가 있을 경우 computedScore = 6 - 예측값을 계산하여 추가합니다.
  const dynamicCards = recommendedCards.map((card, index) => ({
    id: index, // index를 고유 id로 사용
    title: card.card, // 카드 이름
    benefits:
      typeof card.Benefit === "string"
        ? card.Benefit
        : Array.isArray(card.Benefit)
        ? card.Benefit.join("\n")
        : "", // 문자열이 아니면 빈 문자열로 처리
    image: `https://via.placeholder.com/300x400?text=${encodeURIComponent(
      card.card
    )}`,
    prediction: predictions[index] ? predictions[index].prediction[0] : null,
    computedScore: predictions[index]
      ? 6 - predictions[index].prediction[0]
      : 6, // 예측값이 없으면 기본값 6 할당
  }));

  // computedScore 기준으로 오름차순 정렬 (값이 낮을수록 순위가 높음)
  const sortedCards = [...dynamicCards].sort((a, b) => a.computedScore - b.computedScore);
  // 각 카드에 computedRank 부여 (순위: 1, 2, 3, …)
  sortedCards.forEach((card, idx) => {
    card.computedRank = idx + 1;
  });

  const copyCount = sortedCards.length;
  // 무한 슬라이더 효과를 위해 배열을 3회 복제
  const extendedCards = [...sortedCards, ...sortedCards, ...sortedCards];

  // 슬라이더 관련 상태 및 ref
  const [autoSelectedCard, setAutoSelectedCard] = useState(null);
  const [clickedCard, setClickedCard] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const cardListWrapperRef = useRef(null);

  // 초기 렌더 후 중앙(두 번째 그룹)의 첫 카드가 중앙에 오도록 scrollLeft 조정
  useEffect(() => {
    if (cardListWrapperRef.current && copyCount > 0) {
      const wrapper = cardListWrapperRef.current;
      // 각 카드 슬롯 폭: 320px (300px 카드 + 20px 간격)
      // 중앙 복제본의 첫 카드 인덱스: copyCount
      const desiredIndex = copyCount;
      const desiredCardCenter = 20 + desiredIndex * 320 + 150;
      const containerCenter = wrapper.clientWidth / 2;
      wrapper.scrollLeft = desiredCardCenter - containerCenter;
    }
  }, [copyCount]);

  // 추천받은 카드 배열(sortedCards)이 갱신되면, autoSelectedCard가 없을 경우 우선순위 1인 카드(첫 번째 카드)를 자동 선택
  useEffect(() => {
    if (sortedCards.length > 0 && !autoSelectedCard) {
      setAutoSelectedCard(sortedCards[0]);
    }
  }, [sortedCards, autoSelectedCard]);

  // 카드를 클릭하면 해당 카드가 중앙으로 부드럽게 스크롤 및 선택된 카드 상태 업데이트
  const handleSelect = (card) => {
    setClickedCard(card);
    setAutoSelectedCard(card);
    if (cardListWrapperRef.current) {
      const wrapper = cardListWrapperRef.current;
      const containerWidth = wrapper.clientWidth;
      // 원본 배열(sortedCards)에서 해당 카드의 인덱스 찾기
      const originalIndex = sortedCards.findIndex((c) => c.id === card.id);
      const desiredIndex = copyCount + originalIndex;
      const desiredCardCenter = 20 + desiredIndex * 320 + 150;
      const desiredScrollLeft = desiredCardCenter - containerWidth / 2;
      wrapper.scrollLeft = desiredScrollLeft;
    }
  };

  // 스크롤 이벤트 처리: 스크롤 멈춤 후 중앙에 가까운 카드 선택 및 무한 스크롤 보정
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setIsScrolling(true);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      if (cardListWrapperRef.current) {
        const wrapper = cardListWrapperRef.current;
        let scrollLeft = wrapper.scrollLeft;
        const clientWidth = wrapper.clientWidth;
        const totalScrollWidth = copyCount * 320;
        if (scrollLeft < totalScrollWidth * 0.5) {
          scrollLeft += totalScrollWidth;
          wrapper.scrollLeft = scrollLeft;
        } else if (scrollLeft > totalScrollWidth * 1.5) {
          scrollLeft -= totalScrollWidth;
          wrapper.scrollLeft = scrollLeft;
        }
        const containerCenter = scrollLeft + clientWidth / 2;
        // Math.round -> Math.floor 로 변경하여 소수점 내림 처리
        const approximateIndex = Math.floor((containerCenter - 170) / 320);
        const selectedOriginalIndex = approximateIndex % copyCount;
        const newAutoSelectedCard = sortedCards[selectedOriginalIndex];
        setAutoSelectedCard(newAutoSelectedCard);
      }
    }, 200);
  };

  // 추천받은 카드가 없을 경우 로딩 화면 표시
  if (sortedCards.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );
  }

  return (
    <div style={styles.outerContainer}>
      <style>{`
        .card-list-wrapper::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          {clickedCard ? (
            <button style={styles.paymentButton} onClick={handlePayment}>
              선택한 카드로 결제하기
            </button>
          ) : (
            <p style={styles.headerP}>
              보유 중인 카드와 혜택을 확인하고 결제에 사용할 카드를 선택하세요!
            </p>
          )}
        </div>
        <div
          style={styles.cardListWrapper}
          className="card-list-wrapper"
          onScroll={handleScroll}
          ref={cardListWrapperRef}
        >
          <div style={styles.cardList} className="card-list">
            {extendedCards.map((card, index) => {
              const autoIndex =
                autoSelectedCard &&
                sortedCards.findIndex((c) => c.id === autoSelectedCard.id);
              const distance =
                autoIndex !== null ? Math.abs((index % copyCount) - autoIndex) : 0;
              const relativeIndex =
                autoIndex !== null ? (index % copyCount) - autoIndex : 0;
              const isAutoSelected =
                autoSelectedCard && card.id === autoSelectedCard.id;
              const isClicked = clickedCard && card.id === clickedCard.id;
              return (
                <Card
                  key={`${index}-${card.id}`}
                  card={card}
                  onSelect={handleSelect}
                  distance={distance}
                  relativeIndex={relativeIndex}
                  isAutoSelected={isAutoSelected}
                  isClicked={isClicked}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardRecommendation;