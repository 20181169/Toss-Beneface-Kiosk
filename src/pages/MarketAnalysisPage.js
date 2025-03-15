import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Select from "react-select";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";

/**
 * 숫자 파싱 유틸 (CSV에서 읽은 문자열이 비어있거나 숫자가 아닐 수 있으므로 안전하게 처리)
 */
const parseNumber = (val) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

const MarketAnalysisPage = () => {
  // ----- 상태 관리 -----
  const [page, setPage] = useState("매출 분석"); // 라디오버튼 대신 select 등으로 조정 가능

  // CSV 원본 데이터
  const [data, setData] = useState([]);
  const [dummyData, setDummyData] = useState([]);

  // [매출 분석] 필터용 상태
  const [selectedQuarter, setSelectedQuarter] = useState(null);       // 기준_년분기_코드
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(); // 자치구_코드_명
  const [selectedDongCode, setSelectedDongCode] = useState();         // 행정동_코드_명
  const [selectedDistrict, setSelectedDistrict] = useState();         // 상권_코드_명
  const [selectedIndustry, setSelectedIndustry] = useState();         // 서비스_업종_코드_명

  const [analysisSelection, setAnalysisSelection] = useState("요일별 매출 금액"); // [매출 분석] 시각화 유형

  // [내 가게 주변상권 분석] 상태
  const [dummyQuarter, setDummyQuarter] = useState(null); // 더미데이터 선택 분기
  const [neighborSelection, setNeighborSelection] = useState("요일별 매출 금액"); // [주변상권] 시각화 유형

  // ----- CSV 불러오기 -----
  useEffect(() => {
    // Alldata_final3.csv 로드
    axios
      .get("/Alldata_final3.csv", { responseType: "blob" })
      .then((response) => {
        Papa.parse(response.data, {
          header: true,
          encoding: "UTF-8",
          complete: (results) => {
            setData(results.data);
          },
          error: (err) => console.error("[PapaParse Error: main data]", err),
        });
      })
      .catch((error) => {
        console.error("Error loading /Alldata_final3.csv:", error);
      });

    // 더미데이터 로드
    axios
      .get("/더미데이터_예측값.csv", { responseType: "blob" })
      .then((response) => {
        Papa.parse(response.data, {
          header: true,
          encoding: "UTF-8",
          complete: (results) => {
            setDummyData(results.data);
          },
          error: (err) => console.error("[PapaParse Error: dummy data]", err),
        });
      })
      .catch((error) => {
        console.error("Error loading /더미데이터_예측값.csv:", error);
      });
  }, []);

  // ----- [매출 분석] 필터 로직 -----
  // (1) 셀렉트 박스 옵션
  const quarterOptions = Array.from(
    new Set(data.map((item) => item.기준_년분기_코드))
  ).map((v) => ({ value: v, label: v }));

  const districtCodeOptions = Array.from(
    new Set(data.map((item) => item.자치구_코드_명))
  ).map((v) => ({ value: v, label: v }));

  // 행정동 필터
  const dongCodeOptions = selectedDistrictCode
    ? Array.from(
        new Set(
          data
            .filter((item) => item.자치구_코드_명 === selectedDistrictCode)
            .map((item) => item.행정동_코드_명)
        )
      ).map((v) => ({ value: v, label: v }))
    : [];

  // 상권코드(상권_코드_명) 필터
  const districtOptions = selectedDongCode
    ? Array.from(
        new Set(
          data
            .filter((item) => item.행정동_코드_명 === selectedDongCode)
            .map((item) => item.상권_코드_명)
        )
      ).map((v) => ({ value: v, label: v }))
    : [];

  // 서비스 업종(서비스_업종_코드_명) 필터
  const industryOptions = selectedDistrict
    ? Array.from(
        new Set(
          data
            .filter((item) => item.상권_코드_명 === selectedDistrict)
            .map((item) => item.서비스_업종_코드_명)
        )
      ).map((v) => ({ value: v, label: v }))
    : [];

  // (2) 최종 필터링된 데이터
  const filteredData = data.filter(
    (item) =>
      item.기준_년분기_코드 === selectedQuarter &&
      item.자치구_코드_명 === selectedDistrictCode &&
      item.행정동_코드_명 === selectedDongCode &&
      item.상권_코드_명 === selectedDistrict &&
      item.서비스_업종_코드_명 === selectedIndustry
  );

  // ----- [내 가게 주변상권 분석] 로직 -----

  // 1) 더미데이터에서 분기 선택용
  const dummyQuarterOptions = Array.from(
    new Set(dummyData.map((d) => d.기준_년분기_코드))
  ).map((v) => ({ value: v, label: v }));

  // 2) Streamlit 코드는 "선택한 분기"와 상관없이 **dummyData의 첫 번째 행**을 사용
  //    여기서도 원본 로직을 그대로 살리겠습니다.
  //    (만약 분기에 맞춰 더미데이터를 필터링하려면, 아래 로직 수정 필요)
  const dummyRow = dummyData[0];
  // 실제 데이터와 매칭할 조건
  // 자치구_코드_명, 행정동_코드_명, 상권_코드_명, 서비스_업종_코드_명
  let matchedData = [];
  if (dummyRow) {
    matchedData = data.filter(
      (item) =>
        item.자치구_코드_명 === dummyRow["자치구_코드_명"] &&
        item.행정동_코드_명 === dummyRow["행정동_코드_명"] &&
        item.상권_코드_명 === dummyRow["상권_코드_명"] &&
        item.서비스_업종_코드_명 === dummyRow["서비스_업종_코드_명"]
    );
  }

  // ----- 시각화 공통 함수 -----
  /**
   * 매출 분석(Bar 차트) - 요일/시간대/성별/연령대
   */
  const getAnalysisChartData = () => {
    if (!filteredData.length) {
      return { labels: [], datasets: [] };
    }

    // 제목으로 필터 조합 표시
    const title = `${selectedQuarter} | ${selectedDistrictCode} | ${selectedDongCode} | ${selectedDistrict} | ${selectedIndustry}`;

    if (analysisSelection === "요일별 매출 금액") {
      const dayColumns = [
        "월요일_매출_금액",
        "화요일_매출_금액",
        "수요일_매출_금액",
        "목요일_매출_금액",
        "금요일_매출_금액",
        "토요일_매출_금액",
        "일요일_매출_금액",
      ];
      const labels = ["월", "화", "수", "목", "금", "토", "일"];

      // 평균
      const values = dayColumns.map((col) => {
        const sum = filteredData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return sum / filteredData.length;
      });

      return {
        labels,
        datasets: [
          {
            label: `[요일별] 평균 매출 금액 (${title})`,
            data: values,
            backgroundColor: "skyblue",
          },
        ],
      };
    }

    if (analysisSelection === "시간대별 매출 금액") {
      const timeColumns = [
        "시간대_00~06_매출_금액",
        "시간대_06~11_매출_금액",
        "시간대_11~14_매출_금액",
        "시간대_14~17_매출_금액",
        "시간대_17~21_매출_금액",
        "시간대_21~24_매출_금액",
      ];
      const labels = ["00~06", "06~11", "11~14", "14~17", "17~21", "21~24"];

      const values = timeColumns.map((col) => {
        const sum = filteredData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return sum / filteredData.length;
      });

      return {
        labels,
        datasets: [
          {
            label: `[시간대별] 평균 매출 금액 (${title})`,
            data: values,
            backgroundColor: "lightcoral",
          },
        ],
      };
    }

    if (analysisSelection === "성별 매출 금액") {
      const genderColumns = ["남성_매출_금액", "여성_매출_금액"];
      const labels = ["남성", "여성"];

      const values = genderColumns.map((col) => {
        const sum = filteredData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return sum / filteredData.length;
      });

      return {
        labels,
        datasets: [
          {
            label: `[성별] 평균 매출 금액 (${title})`,
            data: values,
            backgroundColor: ["lightcoral", "lightgreen"],
          },
        ],
      };
    }

    if (analysisSelection === "연령대별 매출 금액") {
      const ageColumns = [
        "연령대_10_매출_금액",
        "연령대_20_매출_금액",
        "연령대_30_매출_금액",
        "연령대_40_매출_금액",
        "연령대_50_매출_금액",
        "연령대_60_이상_매출_금액",
      ];
      const labels = ["10대", "20대", "30대", "40대", "50대", "60대+"];

      const values = ageColumns.map((col) => {
        const sum = filteredData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return sum / filteredData.length;
      });

      return {
        labels,
        datasets: [
          {
            label: `[연령대별] 평균 매출 금액 (${title})`,
            data: values,
            backgroundColor: "lightseagreen",
          },
        ],
      };
    }

    return { labels: [], datasets: [] };
  };

  /**
   * 내 가게 주변상권 분석(Line 차트) - 실제 데이터 vs 더미 데이터
   * day/time/gender/age와 동일한 방식으로 두 시리즈를 그립니다.
   * (Streamlit 예시: line plot with marker="o")
   */
  const getNeighborChartData = () => {
    if (!dummyRow) {
      return { labels: [], datasets: [] };
    }

    // matchedData: real data
    // dummyRow: dummy data 한 줄
    // title
    const title = "내 가게 주변상권 비교 (실제 vs 더미)";

    if (neighborSelection === "요일별 매출 금액") {
      const dayColumns = [
        "월요일_매출_금액",
        "화요일_매출_금액",
        "수요일_매출_금액",
        "목요일_매출_금액",
        "금요일_매출_금액",
        "토요일_매출_금액",
        "일요일_매출_금액",
      ];
      const labels = ["월", "화", "수", "목", "금", "토", "일"];

      // 실제 데이터 평균
      const realValues = dayColumns.map((col) => {
        const sum = matchedData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return matchedData.length > 0 ? sum / matchedData.length : 0;
      });

      // 더미 데이터(단일행)
      const dummyValues = dayColumns.map((col) => parseNumber(dummyRow[col]));

      return {
        labels,
        datasets: [
          {
            label: "실제 데이터 (평균)",
            data: realValues,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.1)",
          },
          {
            label: "더미 데이터 (단일행)",
            data: dummyValues,
            borderColor: "orange",
            backgroundColor: "rgba(255,165,0,0.1)",
            borderDash: [5, 5], // 점선
          },
        ],
      };
    }

    if (neighborSelection === "시간대별 매출 금액") {
      const timeColumns = [
        "시간대_00~06_매출_금액",
        "시간대_06~11_매출_금액",
        "시간대_11~14_매출_금액",
        "시간대_14~17_매출_금액",
        "시간대_17~21_매출_금액",
        "시간대_21~24_매출_금액",
      ];
      const labels = ["00~06", "06~11", "11~14", "14~17", "17~21", "21~24"];

      // 실제 데이터 평균
      const realValues = timeColumns.map((col) => {
        const sum = matchedData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return matchedData.length > 0 ? sum / matchedData.length : 0;
      });

      // 더미
      const dummyValues = timeColumns.map((col) => parseNumber(dummyRow[col]));

      return {
        labels,
        datasets: [
          {
            label: "실제 데이터 (평균)",
            data: realValues,
            borderColor: "green",
            backgroundColor: "rgba(0,128,0,0.1)",
          },
          {
            label: "더미 데이터",
            data: dummyValues,
            borderColor: "red",
            backgroundColor: "rgba(255,0,0,0.1)",
            borderDash: [5, 5],
          },
        ],
      };
    }

    if (neighborSelection === "성별 매출 금액") {
      const genderColumns = ["남성_매출_금액", "여성_매출_금액"];
      const labels = ["남성", "여성"];

      // 실제 데이터 평균
      const realValues = genderColumns.map((col) => {
        const sum = matchedData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return matchedData.length > 0 ? sum / matchedData.length : 0;
      });

      // 더미
      const dummyValues = genderColumns.map((col) => parseNumber(dummyRow[col]));

      return {
        labels,
        datasets: [
          {
            label: "실제 데이터 (평균)",
            data: realValues,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.1)",
          },
          {
            label: "더미 데이터",
            data: dummyValues,
            borderColor: "orange",
            backgroundColor: "rgba(255,165,0,0.1)",
            borderDash: [5, 5],
          },
        ],
      };
    }

    if (neighborSelection === "연령대별 매출 금액") {
      const ageColumns = [
        "연령대_10_매출_금액",
        "연령대_20_매출_금액",
        "연령대_30_매출_금액",
        "연령대_40_매출_금액",
        "연령대_50_매출_금액",
        "연령대_60_이상_매출_금액",
      ];
      const labels = ["10대", "20대", "30대", "40대", "50대", "60대+"];

      const realValues = ageColumns.map((col) => {
        const sum = matchedData.reduce((acc, cur) => acc + parseNumber(cur[col]), 0);
        return matchedData.length > 0 ? sum / matchedData.length : 0;
      });

      const dummyValues = ageColumns.map((col) => parseNumber(dummyRow[col]));

      return {
        labels,
        datasets: [
          {
            label: "실제 데이터 (평균)",
            data: realValues,
            borderColor: "green",
            backgroundColor: "rgba(0,128,0,0.1)",
          },
          {
            label: "더미 데이터",
            data: dummyValues,
            borderColor: "red",
            backgroundColor: "rgba(255,0,0,0.1)",
            borderDash: [5, 5],
          },
        ],
      };
    }

    return { labels: [], datasets: [] };
  };

  // ----- 차트 옵션 -----
  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 5,
      },
    },
  };

  // ----- 렌더링 -----
  return (
    <div style={{ padding: "20px" }}>
      <h1>Streamlit 시각화 ㅡ React 시각화 데모</h1>

      {/* Page 전환 (매출 분석 / 내 가게 주변상권 분석) */}
      <div style={{ marginBottom: 20 }}>
        <Select
          options={[
            { value: "매출 분석", label: "매출 분석" },
            { value: "내 가게 주변상권 분석", label: "내 가게 주변상권 분석" },
          ]}
          onChange={(opt) => setPage(opt.value)}
          defaultValue={{ value: "매출 분석", label: "매출 분석" }}
        />
      </div>

      {page === "매출 분석" && (
        <div>
          <h2>📊 매출 분석</h2>
          {/* (A) 분기 선택 */}
          <Select
            placeholder="기준 년-분기를 선택하세요"
            options={quarterOptions}
            onChange={(opt) => setSelectedQuarter(opt.value)}
          />

          {/* (B) 자치구_코드_명 선택 */}
          <Select
            placeholder="자치구를 선택하세요"
            options={districtCodeOptions}
            onChange={(opt) => setSelectedDistrictCode(opt.value)}
            isDisabled={!selectedQuarter}
          />

          {/* (C) 행정동 선택 */}
          <Select
            placeholder="행정동을 선택하세요"
            options={dongCodeOptions}
            onChange={(opt) => setSelectedDongCode(opt.value)}
            isDisabled={!selectedDistrictCode}
          />

          {/* (D) 상권 코드 */}
          <Select
            placeholder="상권을 선택하세요"
            options={districtOptions}
            onChange={(opt) => setSelectedDistrict(opt.value)}
            isDisabled={!selectedDongCode}
          />

          {/* (E) 서비스 업종 */}
          <Select
            placeholder="서비스 업종을 선택하세요"
            options={industryOptions}
            onChange={(opt) => setSelectedIndustry(opt.value)}
            isDisabled={!selectedDistrict}
          />

          {/* (F) 시각화 유형 */}
          <Select
            placeholder="시각화 항목을 선택하세요"
            options={[
              { value: "요일별 매출 금액", label: "요일별 매출 금액" },
              { value: "시간대별 매출 금액", label: "시간대별 매출 금액" },
              { value: "성별 매출 금액", label: "성별 매출 금액" },
              { value: "연령대별 매출 금액", label: "연령대별 매출 금액" },
            ]}
            onChange={(opt) => setAnalysisSelection(opt.value)}
          />

          {/* (G) 결과 차트 */}
          {selectedQuarter && selectedDistrictCode && selectedDongCode && selectedDistrict && selectedIndustry && (
            <Bar data={getAnalysisChartData()} options={barChartOptions} />
          )}
        </div>
      )}

      {page === "내 가게 주변상권 분석" && (
        <div>
          <h2>🏠 내 가게 주변상권 분석</h2>
          {/* 기준 년-분기 코드 선택 */}
          <Select
            placeholder="기준 년-분기를 선택하세요"
            options={dummyQuarterOptions}
            onChange={(opt) => setDummyQuarter(opt.value)} // Streamlit 코드상 quarter를 쓰진 않음
          />

          {/* 더미 데이터 첫 번째 행 기반 정보 표시 */}
          {dummyRow && (
            <>
              <p>
                <strong>자치구명</strong>: {dummyRow["자치구_코드_명"]}
              </p>
              <p>
                <strong>행정동명</strong>: {dummyRow["행정동_코드_명"]}
              </p>
              <p>
                <strong>상권코드명</strong>: {dummyRow["상권_코드_명"]}
              </p>
              <p>
                <strong>서비스업종</strong>: {dummyRow["서비스_업종_코드_명"]}
              </p>
            </>
          )}

          {/* 시각화 선택 (요일/시간대/성별/연령대) */}
          <Select
            placeholder="시각화 항목을 선택하세요"
            options={[
              { value: "요일별 매출 금액", label: "요일별 매출 금액" },
              { value: "시간대별 매출 금액", label: "시간대별 매출 금액" },
              { value: "성별 매출 금액", label: "성별 매출 금액" },
              { value: "연령대별 매출 금액", label: "연령대별 매출 금액" },
            ]}
            onChange={(opt) => setNeighborSelection(opt.value)}
            defaultValue={{ value: "요일별 매출 금액", label: "요일별 매출 금액" }}
          />

          {/* Line 차트로 실제 vs 더미 시각화 */}
          {dummyRow && (
            <Line data={getNeighborChartData()} options={lineChartOptions} />
          )}
        </div>
      )}
    </div>
  );
};

export default MarketAnalysisPage;