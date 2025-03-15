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
 
  export default styles