import React, { useState } from "react";
import Sidebar from "./Sidebar"; // 기존 Sidebar component
// import AddProductModal from "./AddProductModal"; // Modal 예시 (필요 시 주석 해제)
 
const OwnerPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const [products, setProducts] = useState([
    { id: 1, name: "test", price: 100, inStock: true },
    { id: 2, name: "sample 아메리카노", price: 4000, inStock: true },
    { id: 3, name: "sample 에스프레소", price: 4500, inStock: true },
    { id: 4, name: "sample 카푸치노", price: 4500, inStock: true },
    { id: 5, name: "sample 카페라떼", price: 4500, inStock: true },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleAddProduct = (newProduct) => {
    setProducts([...products, { id: products.length + 1, ...newProduct }]);
  };
  const handlePagination = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      setCurrentPage(currentPage + 1);
    }
  };
 
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
<div style={styles.pageContainer}>
      {isSidebarVisible && <Sidebar />}
<div style={styles.mainContent}>
        {/* 헤더 영역 */}
<div style={styles.header}>
<div style={styles.hamburgerIcon} onClick={toggleSidebar}>
            ☰
</div>
<h1 style={styles.title}>상품</h1>
<input
            type="text"
            placeholder="메뉴명 또는 초성 검색"
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
<div style={styles.rightButtons}>
<button style={styles.blueButton}>순서 편집</button>
<button style={styles.blueButton} onClick={() => setIsModalOpen(true)}>
              + 상품 추가
</button>
</div>
</div>
 
        {/* 탭 & 정렬/개수 보기 */}
<div style={styles.tabContainer}>
<div style={styles.tabButtons}>
            {["전체", "기본", "메뉴"].map((tab) => (
<button
                key={tab}
                onClick={() => handleTabClick(tab)}
                style={{
                  ...styles.tabButton,
                  backgroundColor: activeTab === tab ? "#007bff" : "#f0f0f0",
                  color: activeTab === tab ? "#fff" : "#000",
                }}
>
                {tab}
</button>
            ))}
</div>
<div style={styles.sortContainer}>
<span style={{ marginRight: "15px" }}>최신순</span>
<span>100개씩 보기</span>
</div>
</div>
 
        {/* 테이블 영역 */}
<div style={styles.tableWrapper}>
<div style={styles.tableHeader}>
<div style={{ ...styles.headerCell, width: "80px" }}>상품 이미지</div>
<div style={{ ...styles.headerCell, flex: 2 }}>상품 명</div>
<div style={styles.fixedStockHeader}>재고 수량</div>
<div style={{ ...styles.headerCell, flex: 1, textAlign: "right" }}>
            가격
</div>
<div style={{ ...styles.headerCell, flex: 1, textAlign: "right" }}>
            수정
</div>
</div>
 
          {/* 테이블 바디 */}
          {filteredProducts.map((product) => (
<div key={product.id} style={styles.tableRow}>
<div style={styles.imageCell}>
<div style={styles.imageBox}>+ 이미지</div>
</div>
<div style={styles.nameCell}>{product.name}</div>
              {/* 재고 수량 셀: 고정 크기의 박스 적용 */}
<div style={styles.stockColumn}>
                {product.inStock ? "재고 있음" : "품절"}
</div>
<div style={{ ...styles.priceCell, textAlign: "right" }}>
                {product.price}
</div>
<div style={{ ...styles.editCell, textAlign: "right" }}>
<button
                  style={styles.editButton}
                  onClick={() => {
                    // 수정 로직 구현 (예: 모달 열기)
                    console.log("상품 수정:", product);
                  }}
>
                  수정
</button>
</div>
</div>
          ))}
</div>
 
        {/* 페이지네이션 */}
<div style={styles.pagination}>
<button style={styles.paginationBtn} onClick={() => handlePagination("prev")}>
&lt;
</button>
<div style={styles.pageNumber}>{currentPage}</div>
<button style={styles.paginationBtn} onClick={() => handlePagination("next")}>
&gt;
</button>
</div>
 
        {/* (선택) + 상품 추가 모달 (필요 시 주석 해제)
<AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddProduct={handleAddProduct}
        /> */}
</div>
</div>
  );
};
 
export default OwnerPage;
 
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
  // 재고 수량/상태 헤더에 적용할 고정 스타일 (헤더 전용)
  fixedStockHeader: {
    flex: "0 0 120px", // 고정 폭 120px로 확장/축소 금지
    width: "120px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box", // 테두리 포함
    margin: 0,
    padding: 0,
  },
  tableRow: {
    display: "flex",
    borderBottom: "1px solid #eee",
    alignItems: "center",
    padding: "10px",
  },
  imageCell: {
    width: "80px",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
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
  nameCell: {
    flex: 2,
    padding: "0 10px",
  },
  // 재고 수량/상태 셀 (본문 행용; 헤더와 동일하게 고정)
  stockColumn: {
    flex: "0 0 120px", // 고정 폭 120px
    width: "120px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  priceCell: {
    flex: 1,
  },
  editCell: {
    flex: 1,
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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