import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import AddProductModal from "./AddProductModal";
import styles from "../styles/OwnerPageStyle";
 
const OwnerPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const [products, setProducts] = useState([]); // 상품 목록
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // modalProduct가 null이면 추가 모드, 값이 있으면 수정 모드로 동작
  const [modalProduct, setModalProduct] = useState(null);
 
  // 매장정보 받아오기
  console.log('ownerpage')
  const matchedBrand = sessionStorage.getItem("matchedBrand");
  console.log(matchedBrand)
  useEffect(() => {
    fetchProducts();
  }, []);
 
  // 상품 데이터 가져오기
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/products");
      // matchedBrand와 일치하는 데이터 필터링
      console.log('inside')
      console.log(matchedBrand)
      const filteredProducts = response.data.filter(
        (product) => product.cafe === matchedBrand
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("상품 데이터를 불러오는 중 오류 발생:", error);
    }
  };
 
  // 모달에서 추가 또는 수정 후 목록 새로고침
  const handleRefresh = async () => {
    await fetchProducts();
  };
 
  // 검색 기능
  const handleSearch = (e) => setSearchTerm(e.target.value);
 
  // 탭 변경
  const handleTabClick = (tab) => setActiveTab(tab);
 
  // 페이지네이션 핸들링
  const handlePagination = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      setCurrentPage(currentPage + 1);
    }
  };
 
  // 검색 필터 적용
  const filteredProducts = products.filter((p) =>
    p.menu.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  // 모달 열기 - 상품 추가 모드
  const handleOpenAddModal = () => {
    setModalProduct(null);
    setIsModalOpen(true);
  };
 
  // 모달 열기 - 상품 수정 모드
  const handleEditProductClick = (product) => {
    setModalProduct(product);
    setIsModalOpen(true);
  };
 
  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalProduct(null);
  };
 
  return (
    <div style={styles.pageContainer}>
      {isSidebarVisible && <Sidebar />}
 
      <div style={styles.mainContent}>
        {/* 헤더 */}
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
            <button style={styles.blueButton} onClick={handleOpenAddModal}>
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
 
        {/* 상품 목록 테이블 */}
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <div style={{ ...styles.headerCell, width: "80px" }}>
              상품 이미지
            </div>
            <div style={{ ...styles.headerCell, flex: 2 }}>상품 명</div>
            <div style={styles.fixedStockHeader}>재고 수량</div>
            <div style={{ ...styles.headerCell, flex: 1, textAlign: "right" }}>
              가격
            </div>
            <div style={{ ...styles.headerCell, flex: 1, textAlign: "right" }}>
              수정
            </div>
          </div>
 
          {/* 상품 행 */}
          {filteredProducts.map((product) => (
            <div key={product.id} style={styles.tableRow}>
              <div style={styles.imageCell}>
                <div style={styles.imageBox}>
                  {product.img ? (
                    <img
                      src={product.img}
                      alt={product.menu}
                      style={styles.productImage}
                    />
                  ) : (
                    "+ 이미지"
                  )}
                </div>
              </div>
              <div style={styles.nameCell}>{product.menu}</div>
              <div style={styles.stockColumn}>
                {product.stock > 0 ? "재고 있음" : "품절"}
              </div>
              <div style={{ ...styles.priceCell, textAlign: "right" }}>
                {product.price}원
              </div>
              <div style={{ ...styles.editCell, textAlign: "right" }}>
                <button
                  style={styles.editButton}
                  onClick={() => handleEditProductClick(product)}
                >
                  수정
                </button>
              </div>
            </div>
          ))}
        </div>
 
        {/* 페이지네이션 */}
        <div style={styles.pagination}>
          <button
            style={styles.paginationBtn}
            onClick={() => handlePagination("prev")}
          >
            &lt;
          </button>
          <div style={styles.pageNumber}>{currentPage}</div>
          <button
            style={styles.paginationBtn}
            onClick={() => handlePagination("next")}
          >
            &gt;
          </button>
        </div>
 
        {/* AddProductModal을 추가/수정 모두에 재사용 */}
        {isModalOpen && (
          <AddProductModal
            product={modalProduct} // modalProduct가 있으면 수정 모드, 없으면 추가 모드
            onClose={handleCloseModal}
            onRefresh={handleRefresh}
          />
        )}
      </div>
    </div>
  );
};
 
export default OwnerPage;