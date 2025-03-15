import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

function MapPage() {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API is not available.");
      return;
    }

    window.kakao.maps.load(() => {
      const kakao = window.kakao;
      const container = mapRef.current;
      const options = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 5,
      };

      const map = new kakao.maps.Map(container, options);

      // 마커 및 오버레이 초기화
      let placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
        contentNode = document.createElement("div"),
        markers = [],
        currCategory = "";

      contentNode.className = "placeinfo_wrap";

      // 지도 이벤트 등록
      kakao.maps.event.addListener(map, "idle", searchPlaces);

      // 커스텀 오버레이 초기화
      placeOverlay.setContent(contentNode);

      // 장소 검색 객체 생성
      const ps = new kakao.maps.services.Places(map);

      // 카테고리 클릭 이벤트 추가
      addCategoryClickEvent();

      // 검색 관련 함수
      function searchPlaces() {
        if (!currCategory) return;
        placeOverlay.setMap(null);
        removeMarker();
        ps.categorySearch(currCategory, placesSearchCB, { useMapBounds: true });
      }

      function placesSearchCB(data, status) {
        if (status === kakao.maps.services.Status.OK) {
          displayPlaces(data);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          console.log("검색 결과가 없습니다.");
        } else if (status === kakao.maps.services.Status.ERROR) {
          console.error("검색 중 오류가 발생했습니다.");
        }
      }

      function displayPlaces(places) {
        const order = document.getElementById(currCategory).getAttribute("data-order");
        for (let i = 0; i < places.length; i++) {
          const marker = addMarker(
            new kakao.maps.LatLng(places[i].y, places[i].x),
            order
          );

          (function (marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
              displayPlaceInfo(place);
            });
          })(marker, places[i]);
        }
      }

      function addMarker(position, order) {
        const imageSrc =
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png",
          imageSize = new kakao.maps.Size(27, 28),
          imgOptions = {
            spriteSize: new kakao.maps.Size(72, 208),
            spriteOrigin: new kakao.maps.Point(46, order * 36),
            offset: new kakao.maps.Point(11, 28),
          },
          markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
          marker = new kakao.maps.Marker({
            position: position,
            image: markerImage,
          });

        marker.setMap(map);
        markers.push(marker);
        return marker;
      }

      function removeMarker() {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }

      function displayPlaceInfo(place) {
        console.log("Displaying place information:", place);

        const placeLat = parseFloat(place.y);
        const placeLon = parseFloat(place.x);

        // 세션 스토리지에 위도와 경도 저장
        sessionStorage.setItem("latitude", placeLat);
        sessionStorage.setItem("longitude", placeLon);
        console.log(`Saved to sessionStorage: latitude=${placeLat}, longitude=${placeLon}`);

        fetch("/Alldata_final4.csv")
          .then((response) => {
            if (!response.ok) throw new Error("Failed to load CSV");
            return response.text();
          })
          .then((csvText) => {
            // Papa Parse를 사용하여 CSV 파싱 (헤더 포함, 빈 줄 스킵)
            const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
            const rows = results.data;

            let bestRow = null;
            let minDist = Infinity;

            for (const row of rows) {
              // CSV의 "위도" 컬럼은 실제 경도, "경도" 컬럼은 실제 위도로 처리
              const csvLon = parseFloat(row["위도"]);
              const csvLat = parseFloat(row["경도"]);

              if (isNaN(csvLat) || isNaN(csvLon)) continue;

              // 유클리드 거리 계산
              const dist = Math.sqrt((csvLat - placeLat) ** 2 + (csvLon - placeLon) ** 2);

              if (dist < minDist) {
                minDist = dist;
                bestRow = row;
              }
            }

            if (bestRow) {
              console.log("가장 가까운 행:", bestRow, "거리:", minDist);
              // 예시로 bestRow의 상권_코드와 서비스_업종_코드를 세션에 저장
              sessionStorage.setItem("latitude", bestRow["상권_코드"]);
              sessionStorage.setItem("longitude", bestRow["서비스_업종_코드"]);
              console.log("가장 가까운 행 - 상권_코드:", bestRow["상권_코드"]);
              console.log("가장 가까운 행 - 서비스_업종_코드:", bestRow["서비스_업종_코드"]);


              // analyze API 호출 (비동기)
              fetch("https://benefacefastapi20-frgtcya5bnefbdfs.koreacentral-01.azurewebsites.net/fastapi/analyze", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  store_params: ["1"],
                  district_params: [
                    bestRow["상권_코드"],
                    bestRow["서비스_업종_코드"]
                  ],
                }),
              })
                .then((response) => {
                  if (!response.ok) throw new Error("Analyze API 호출 실패");
                  return response.json();
                })
                .then((result) => {
                  console.log("Analyze API result:", result);
                  // API 결과를 세션 스토리지에 저장 (문자열로 변환)
                  sessionStorage.setItem("analysis_result", JSON.stringify(result));
                })
                .catch((err) => {
                  console.error("Error calling analyze API:", err);
                });
            } else {
              console.log("매칭된 행이 없습니다.");

            }
          })
          .catch((error) => {
            console.error("Error loading CSV:", error);
          })
          .finally(() => {
            console.log("Processing place information...");
          });

        // 카테고리 및 브랜드 매칭 등 추가 로직 (기존 코드 유지)
        const categoryName = place.category_name;
        let nextCategory = null;

        const coffee_brands = [
          "공차", "까페베네", "달콤", "드롭탑", "메가커피", "블루보틀",
          "빈스앤베리스", "빽다방", "삼성타운", "센터원", "스타벅스", "아티제",
          "엔제리너스", "엔젤리너스", "이디야", "카페베네", "카페아티제",
          "커피빈", "탐앤탐스", "투썸플레이스", "파스쿠찌",
          "폴 바셋", "폴바셋", "할리스"
        ];
        console.log('998877');
        console.log('Place Name:', place.place_name);
        sessionStorage.setItem("place_name", place.place_name);
        if (categoryName.includes("음식점 > ")) {
          const afterRestaurant = categoryName.split("음식점 > ")[1].trim();
          const subParts = afterRestaurant.split(">").map((s) => s.trim());
          nextCategory = subParts[0]; // 예: '한식'
        }

        console.log("categoryName:", categoryName);
        console.log("nextCategory:", nextCategory);

        const matchedBrand = coffee_brands.find((brand) =>
          place.place_name.includes(brand)
        );
        sessionStorage.setItem("matchedBrand", matchedBrand);
        if (matchedBrand) {
          console.log(`Matched Brand: ${matchedBrand}`);
          // 매칭된 브랜드가 있으면 방문 페이지로 이동
          navigate('/visitPage', {
            state: {
              brand: matchedBrand,
              // 필요한 추가 데이터 포함
            },
          });
        } else {
          console.log("No matching brand found.");
        }

        let content =
          '<div class="placeinfo">' +
          '   <a class="title" href="' +
          place.place_url +
          '" target="_blank" title="' +
          place.place_name +
          '">' +
          place.place_name +
          "</a>";

        if (place.road_address_name) {
          content +=
            '    <span title="' +
            place.road_address_name +
            '">' +
            place.road_address_name +
            "</span>" +
            '  <span class="jibun" title="' +
            place.address_name +
            '">(지번 : ' +
            place.address_name +
            ")</span>";
        } else {
          content +=
            '    <span title="' +
            place.address_name +
            '">' +
            place.address_name +
            "</span>";
        }

        content +=
          '    <span class="tel">' +
          place.phone +
          "</span>" +
          "</div>" +
          '<div class="after"></div>';

        contentNode.innerHTML = content;
        placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
        placeOverlay.setMap(map);
      }

      function addCategoryClickEvent() {
        const category = document.getElementById("category"),
          children = category.children;

        for (let i = 0; i < children.length; i++) {
          children[i].onclick = onClickCategory;
        }
      }

      function onClickCategory() {
        const id = this.id,
          className = this.className;

        placeOverlay.setMap(null);

        if (className === "on") {
          currCategory = "";
          changeCategoryClass();
          removeMarker();
        } else {
          currCategory = id;
          changeCategoryClass(this);
          searchPlaces();
        }
      }

      function changeCategoryClass(el) {
        const category = document.getElementById("category"),
          children = category.children;

        for (let i = 0; i < children.length; i++) {
          children[i].className = "";
        }

        if (el) {
          el.className = "on";
        }
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col m-0 p-0">
      
      {/* 지도 컨테이너 - 남은 공간을 모두 채움 */}
      <div id="map" ref={mapRef} className="flex-grow w-full"></div>
      
      {/* 하단 카테고리 영역 */}
      <ul id="category" className="flex-none p-4">
        <li id="FD6" data-order="0">
          <span className="category_bg store"></span>
          음식점
        </li>
        <li id="MT1" data-order="1">
          <span className="category_bg mart"></span>
          마트
        </li>
        <li id="PM9" data-order="2">
          <span className="category_bg pharmacy"></span>
          약국
        </li>
        <li id="OL7" data-order="3">
          <span className="category_bg oil"></span>
          주유소
        </li>
        <li id="CE7" data-order="4">
          <span className="category_bg cafe"></span>
          카페
        </li>
        <li id="CS2" data-order="5">
          <span className="category_bg store"></span>
          편의점
        </li>
      </ul>
    </div>
  );
}

export default MapPage;
