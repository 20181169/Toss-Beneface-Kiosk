import React, { useState } from "react";
import axios from "axios";
 
const AddProductModal = ({ product, onClose, onRefresh }) => {
  // product prop이 있을 경우 수정 모드, 없으면 추가 모드
  const [menu, setMenu] = useState(product?.menu || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [img, setImg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(product?.img || "");
  const matchedBrand = sessionStorage.getItem("matchedBrand");
  // 이미지 파일 선택 시 미리보기 설정
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
 
  // 모달 닫기 (데이터 초기화 포함)
  const handleClose = () => {
    setMenu("");
    setPrice("");
    setStock("");
    setImg(null);
    setPreviewUrl("");
    onClose();
  };
 
  // 상품 추가 또는 수정 요청
  const handleSubmit = async () => {
    // 세션 스토리지에서 matchedBrand를 가져옵니다.
    // FormData 생성
    const formData = new FormData();
    formData.append("menu", menu);
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
  
    // cafe (또는 원하는 필드명)에 matchedBrand를 담아 전송
    formData.append("cafe", matchedBrand ?? "");
  
    if (img) {
      formData.append("img", img);
    }
  
    try {
      if (product) {
        // 수정 모드( PUT )
        await axios.put(
          `https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/products/${product.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // 추가 모드( POST )
        await axios.post("https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      onRefresh();  // 상품 목록 새로고침
      handleClose(); // 모달 닫기
    } catch (error) {
      console.error(
        "업로드 실패:",
        error.response ? error.response.data : error.message
      );
    }
  };
 
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeButtonStyle} onClick={handleClose}>
          ✖
        </button>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {product ? "상품 수정" : "상품 추가"}
        </h2>
        <div style={formGroupStyle}>
          <label>상품 이름</label>
          <input
            type="text"
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>상품 이미지</label>
          <input type="file" onChange={handleImageChange} style={inputStyle} />
          <div style={previewContainerStyle}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="미리보기"
                style={previewImageStyle}
              />
            ) : (
              <div style={emptyPreviewStyle}>이미지 없음</div>
            )}
          </div>
        </div>
        <div style={formGroupStyle}>
          <label>상품 가격</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>재고 수량</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={buttonContainerStyle}>
          <button style={cancelButtonStyle} onClick={handleClose}>
            취소
          </button>
          <button style={addButtonStyle} onClick={handleSubmit}>
            {product ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};
 
// 스타일 정의
const previewContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "150px",
  height: "150px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  marginTop: "10px",
};
 
const previewImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
 
const emptyPreviewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  fontSize: "12px",
  color: "#999",
};
 
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
 
const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  position: "relative",
};
 
const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};
 
const formGroupStyle = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
};
 
const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginTop: "5px",
  fontSize: "14px",
};
 
const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};
 
const cancelButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#ccc",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
 
const addButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
 
export default AddProductModal;