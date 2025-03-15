import React, { useState, useEffect } from 'react';
import '../MarketAnalysisPage.css';
import Sidebar from "./Sidebar";
// Recharts 컴포넌트 임포트
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  ResponsiveContainer
} from 'recharts';


const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF6699", "#9933FF"];

const containerStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  width: "100%",
  fontFamily: "Pretendard, sans-serif",
  backgroundColor: "#F9FAFB", // 기존 흰색 → 연한 블루그레이
  minHeight: "100vh",
};

const mainContentStyle = {
  flex: 1,
  padding: "40px 60px",
};

const sectionStyle = {
  background: "white",
  borderRadius: "16px", // 기존보다 더 둥글게 변경
  padding: "32px",
  boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)", // 그림자 효과 추가
  transition: "all 0.3s ease-in-out",
  marginBottom: "32px",
  width: "100%",
};


const titleStyle = {
  fontSize: "24px", // 기존 28px → 24px로 조정
  fontWeight: "700",
  color: "#222222",
  marginBottom: "24px",
};

const categoryTitleStyle = {
  fontSize: "18px", // 기존 22px → 18px로 조정
  fontWeight: "600",
  color: "#333333",
  marginBottom: "20px",
  paddingLeft: "16px",
  borderLeft: "4px solid #2563eb", // 기존 토스 블루 계열 강조
};


function MarketAnalysisPage() {


  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
  // 사이드바 보이기 / 숨기기 토글 함수
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  

  // API에서 받아온 데이터를 저장할 state
  const [merchantData, setMerchantData] = useState(null);
  const [areaData, setAreaData] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const placeName = sessionStorage.getItem("place_name");
  // API 호출: localhost:8000/analyze, POST 방식으로 store_params, district_params 포함
  useEffect(() => {
    const analysisResultStr = sessionStorage.getItem("analysis_result");
    console.log(analysisResultStr)
    if (!analysisResultStr) {
      console.error("세션에 저장된 분석 결과가 없습니다.");
      return;
    }
    
    if (analysisResultStr) {
      try {
        // JSON 문자열을 파싱하여 객체로 변환
        const parsedData = JSON.parse(analysisResultStr);
        // 객체 내 "analysis_result" 키의 값 추출
        const analysis_result = parsedData.analysis_result;
        setAnalysisResult(analysis_result);
        console.log("analysis_result:", analysis_result);
      } catch (e) {
        console.error("JSON 파싱 에러:", e);
      }
    } else {
      console.log("세션 스토리지에 analysis_result 값이 없습니다.");
    }

    // 저장된 문자열을 파싱하여 객체로 변환합니다.
    const data = JSON.parse(analysisResultStr);

    // -------------------------------
    // store_data: 가맹점 데이터 (여러 줄의 문자열)
    // -------------------------------
    const storeDataLines = data.store_data.split('\n');
    // 단일 인용부호를 이중 인용부호로 변경한 후 JSON.parse
    const merchantDayOfWeek = JSON.parse(storeDataLines[0].replace(/'/g, '"'));
    const merchantTimeslotArr = JSON.parse(storeDataLines[1].replace(/'/g, '"'));
    const merchantAgeArr = JSON.parse(storeDataLines[2].replace(/'/g, '"'));
    const merchantGenderArr = JSON.parse(storeDataLines[3].replace(/'/g, '"'));
    const merchantMonthly = JSON.parse(storeDataLines[4].replace(/'/g, '"'));
    // 배열 내 단일 객체인 경우 첫 요소만 사용
    const merchantTimeslot = merchantTimeslotArr[0];
    const merchantAge = merchantAgeArr[0];
    const merchantGender = merchantGenderArr[0];

    // -------------------------------
    // district_data: 상권 데이터 (여러 줄의 문자열)
    // -------------------------------
    const districtDataLines = data.district_data.split('\n');
    const areaDayOfWeekArr = JSON.parse(districtDataLines[0].replace(/'/g, '"'));
    const areaTimeslotArr = JSON.parse(districtDataLines[1].replace(/'/g, '"'));
    const areaAgeArr = JSON.parse(districtDataLines[2].replace(/'/g, '"'));
    const areaGenderArr = JSON.parse(districtDataLines[3].replace(/'/g, '"'));
    const areaMonthlyArr = JSON.parse(districtDataLines[4].replace(/'/g, '"'));
    // 상권 요일별 데이터는 한 객체로 되어 있으므로, 이를 배열로 변환
    const areaDayOfWeekObj = areaDayOfWeekArr[0] || {};
    const areaDayOfWeek = [
      { day_of_week: "Monday", total_sales: areaDayOfWeekObj.monday_sales || 0 },
      { day_of_week: "Tuesday", total_sales: areaDayOfWeekObj.tuesday_sales || 0 },
      { day_of_week: "Wednesday", total_sales: areaDayOfWeekObj.wednesday_sales || 0 },
      { day_of_week: "Thursday", total_sales: areaDayOfWeekObj.thursday_sales || 0 },
      { day_of_week: "Friday", total_sales: areaDayOfWeekObj.friday_sales || 0 },
      { day_of_week: "Saturday", total_sales: areaDayOfWeekObj.saturday_sales || 0 },
      { day_of_week: "Sunday", total_sales: areaDayOfWeekObj.sunday_sales || 0 },
    ];
    const areaTimeslot = areaTimeslotArr[0];
    const areaAge = areaAgeArr[0];
    const areaGender = areaGenderArr[0];
    // 상권 월별 데이터
    const areaMonthly = areaMonthlyArr;

    // -------------------------------
    // predicted_data: 필요시 파싱 (여러 줄의 문자열)
    // -------------------------------
    const predictedDataLines = data.predicted_data.split('\n');
    const predictedDataParsed = predictedDataLines.map(line => JSON.parse(line.replace(/'/g, '"')));

    // state에 저장
    setMerchantData({
      dayOfWeek: merchantDayOfWeek,
      timeslot: merchantTimeslot,
      age: merchantAge,
      gender: merchantGender,
      monthly: merchantMonthly
    });
    setAreaData({
      dayOfWeek: areaDayOfWeek,
      timeslot: areaTimeslot,
      age: areaAge,
      gender: areaGender,
      monthly: areaMonthly
    });
    setPredictedData(predictedDataParsed);
  }, []);


  // ---------------------------------
  // 렌더링 함수들
  // ---------------------------------

  // 1) 성별 매출 (원형 그래프)
  const renderGenderCharts = () => {
    if (!merchantData || !areaData) return null;
    const merchantPieData = [
      { name: "Male", value: merchantData.gender.male_sales },
      { name: "Female", value: merchantData.gender.female_sales }
    ];
    const areaPieData = [
      { name: "Male", value: areaData.gender.male_sales },
      { name: "Female", value: areaData.gender.female_sales }
    ];
    return (
      <div style={{ display: "flex",  flexDirection: "row", gap: "60px", alignItems: "center", width: "100%" }}>
        {/* 가맹점 */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>가맹점 성별 매출</h3>
          <ResponsiveContainer width="100%" height={350}>

            <PieChart>
              <Pie
                data={merchantPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                labelLine={false}
              >
                {merchantPieData.map((entry, index) => (
                  <Cell key={`mCell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

  
        {/* 상권 */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>상권 성별 매출</h3>
          <ResponsiveContainer width="100%" height={350}>

            <PieChart>
              <Pie
                data={areaPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                labelLine={false}
              >
                {areaPieData.map((entry, index) => (
                  <Cell key={`aCell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 2) 연령대별 매출 (원형 그래프)
  const renderAgeCharts = () => {
    if (!merchantData || !areaData) return null;
    const merchantPieData = Object.entries(merchantData.age).map(([key, val]) => ({
      name: key.replace("sales_", ""),
      value: val
    }));
    const areaPieData = Object.entries(areaData.age).map(([key, val]) => ({
      name: key.replace("sales_", ""),
      value: val
    }));
    return (

      <div style={{ display: "flex", flexDirection: "row", gap: "60px", alignItems: "center", width: "100%" }}>
        {/* 가맹점 */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>가맹점 연령대별 매출</h3>

          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={merchantPieData}
                dataKey="value"
                nameKey="name"

                outerRadius={120} // 반지름
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}

                labelLine={false}
              >
                {merchantPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>


        {/* 상권 */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>상권 연령대별 매출</h3>

          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={areaPieData}
                dataKey="value"
                nameKey="name"

                outerRadius={120} // 반지름
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}

                labelLine={false}
              >
                {areaPieData.map((entry, index) => (
                  <Cell key={`aAgeCell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 3) 요일별 매출 (막대 그래프)
  const renderDayOfWeekChart = () => {
    if (!merchantData || !areaData) return null;
    const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const chartData = order.map(day => {
      const mItem = merchantData.dayOfWeek.find(item => item.day_of_week === day) || { total_sales: 0 };
      const aItem = areaData.dayOfWeek.find(item => item.day_of_week === day) || { total_sales: 0 };
      return { day_of_week: day, merchant: mItem.total_sales, area: aItem.total_sales };
    });
    return (
      <div style={sectionStyle}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            barCategoryGap="20%"
            barGap={5}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day_of_week" />
            <YAxis tickMargin={10} padding={{ left: 10, right: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="merchant" fill="#82ca9d" name="가맹점" />
            <Bar dataKey="area" fill="#8884d8" name="상권" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 4) 시간대별 매출 (막대 그래프)
  const renderTimeslotChart = () => {
    if (!merchantData || !areaData) return null;
    const timeslotOrder = ["sales_00_06", "sales_06_11", "sales_11_14", "sales_14_17", "sales_17_21", "sales_21_24"];
    const chartData = timeslotOrder.map(slot => ({
      timeslot: slot,
      merchant: merchantData.timeslot[slot] || 0,
      area: areaData.timeslot[slot] || 0
    }));
    return (
      <div style={sectionStyle}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            barCategoryGap="20%"
            barGap={5}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeslot" />
            <YAxis tickMargin={10} padding={{ left: 10, right: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="merchant" fill="#ffa07a" name="가맹점" />
            <Bar dataKey="area" fill="#20b2aa" name="상권" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };


  // ---------------------------------
  // 5) 분기별 매출 (꺾은선 그래프) - (가맹점 vs 상권) 한 그래프
  // ---------------------------------

  const renderMonthlyChart = () => {
    if (!merchantData || !areaData) return null;
    const mData = merchantData.monthly.map(item => ({
      month: item.month,
      merchant: item.total_sales
    }));
    const aData = areaData.monthly.map(item => ({
      month: item.month || item.quarter_year_code,
      area: Number(item.total_sales)
    }));
    let mergedObj = {};
    mData.forEach(d => {
      mergedObj[d.month] = { month: d.month, merchant: d.merchant, area: 0 };
    });
    aData.forEach(d => {
      if (mergedObj[d.month]) {
        mergedObj[d.month].area = d.area;
      } else {
        mergedObj[d.month] = { month: d.month, merchant: 0, area: d.area };
      }
    });
    const mergedArray = Object.values(mergedObj).sort((a, b) =>
      String(a.month).localeCompare(String(b.month))
    );
    return (
      <div style={sectionStyle}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mergedArray} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickMargin={10} padding={{ left: 10, right: 10 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="merchant" stroke="#ff7300" name="가맹점" />
            <Line type="monotone" dataKey="area" stroke="#387908" name="상권" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 최종 JSX: 모든 차트를 순서대로 렌더링
  return (

    <div style={containerStyle}>
    {isSidebarVisible && <Sidebar />}

    <div style={mainContentStyle}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
        <div style={{ cursor: "pointer", fontSize: "24px", marginRight: "16px" }} onClick={toggleSidebar}>☰</div>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#000" }}>가맹점 vs 상권 데이터 시각화</h1>
      </div>

      {/* 월별 매출 */}
      <section style={sectionStyle}>
        <h2 style={categoryTitleStyle}>분기별 매출</h2>
        {renderMonthlyChart()}
      </section>

      {/* 성별 매출 */}
      <section style={sectionStyle}>
        <h2 style={categoryTitleStyle}>성별 매출</h2>
        {renderGenderCharts()}
      </section>

      {/* 연령대별 매출 */}
      <section style={sectionStyle}>
        <h2 style={categoryTitleStyle}>연령대별 매출</h2>
        {renderAgeCharts()}
      </section>

      {/* 요일별 매출 */}
      <section style={sectionStyle}>
        <h2 style={categoryTitleStyle}>요일별 매출</h2>
        {renderDayOfWeekChart()}
      </section>

      {/* 시간대별 매출 */}
      <section style={sectionStyle}>
        <h2 style={categoryTitleStyle}>시간대별 매출</h2>
        {renderTimeslotChart()}
      </section>
      {analysisResult && (
        <section className="section">
          <h2 className="section-header">
            <strong style={{ color: 'blue' }}>{placeName}</strong>에 대한 분석 결과
          </h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {analysisResult}
          </pre>
        </section>
      )}
    </div>
  </div>

  );
}

export default MarketAnalysisPage;

/** 인라인 스타일 정의 */
const styles = {
  pageContainer: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9fafc",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    gap: "16px",
  },
  hamburgerIcon: {
    cursor: "pointer",
    fontSize: "24px",
  },
  title: {
    fontSize: "24px",
    margin: 0,
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  rightButtons: {
    display: "flex",
    gap: "10px",
  },
  blueButton: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  tabContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    alignItems: "center",
  },
  tabButtons: {
    display: "flex",
    gap: "10px",
  },
  tabButton: {
    padding: "8px 16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  sortContainer: {
    color: "#666",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  tableWrapper: {
    backgroundColor: "#f5f7fa",
    border: "1px solid #ddd",
    borderRadius: "5px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "flex",
    backgroundColor: "#f8f9fb",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    color: "#555",
  },
  headerCell: {
    flex: 1,
    padding: "10px",
  },
  tableRow: {
    display: "flex",
    borderBottom: "1px solid #eee",
    alignItems: "center",
    padding: "10px",
  },
  mainCell: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  imageBox: {
    width: "50px",
    height: "50px",
    backgroundColor: "#e9ecef",
    borderRadius: "5px",
    fontSize: "12px",
    color: "#999",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  stockCell: {
    width: "80px",
    textAlign: "center",
  },
  toggleCell: {
    width: "80px",
    textAlign: "center",
  },
  toggleWrapper: {
    position: "relative",
    width: "40px",
    height: "20px",
    display: "inline-block",
  },
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  toggleSlider: {
    position: "absolute",
    cursor: "pointer",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#ccc",
    transition: ".4s",
    borderRadius: "20px",
  },

  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  paginationBtn: {
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  pageNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "16px",
    backgroundColor: "#e9ecef",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
};