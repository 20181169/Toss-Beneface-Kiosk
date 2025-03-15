import React, { useState } from "react";
import { createQnaBoard } from "../api/qnaBoardApi";
import { useNavigate } from "react-router-dom";
import { handleAuthError } from "../utils/errorHandler";

const QnaCreatePage = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const requestDto = {
      title: newTitle,
      content: newContent,
    };

    try {
      setIsUploading(true);
      await createQnaBoard(requestDto, files, navigate);
      setNewTitle("");
      setNewContent("");
      setFiles([]);
      alert("QnA 게시글이 생성되었습니다!");
      navigate("/qna"); // 생성 후 QnA 목록 페이지로 이동
    } catch (error) {
      handleAuthError(error, navigate, "QnA 생성 중 오류 발생:");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F8FA", // 토스 느낌의 밝은 배경
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",   // 수직 중앙
        alignItems: "center",       // 수평 중앙
        padding: "20px",            // 화면 가장자리 여백
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      {/* 카드 형태로 감싸기 */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "40px",
        }}
      >
        {/* 제목 입력 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            제목
          </label>
          <input
            type="text"
            placeholder="제목 입력"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
        </div>

        {/* 내용 입력 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            내용
          </label>
          <textarea
            placeholder="내용 입력"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{
              width: "100%",
              height: "140px",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              outline: "none",
              resize: "none",
            }}
          />
        </div>

        {/* 파일 첨부 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            파일 첨부
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            style={{
              fontSize: "16px",
            }}
          />
        </div>

        {/* 작성 버튼 */}
        <button
          onClick={handleCreate}
          disabled={isUploading}
          style={{
            width: "100%",
            padding: "14px 20px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#fff",
            backgroundColor: "#0064FF", // 토스 메인 컬러
            border: "none",
            borderRadius: "8px",
            cursor: isUploading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {isUploading ? "추가 중..." : "작성 완료"}
        </button>
      </div>
    </div>
  );
};

export default QnaCreatePage;