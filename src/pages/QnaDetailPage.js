import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQnaBoard } from "../api/qnaBoardApi"; // ✅ 수정
import { handleAuthError } from "../utils/errorHandler";

const QnaDetailPage = () => {
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getQnaBoard(id, navigate); // 게시글 상세 데이터 가져오기
        setPost(response);
      } catch (error) {
        handleAuthError(error, navigate, "게시글을 불러오는 중 오류 발생:");
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (!post) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: "18px",
        }}
      >
        로딩 중...
      </div>
    );
  }

  return (
    <div
      style={{
        /* 화면 전체에 배경 + 위아래 여백 크게 */
        minHeight: "100vh",
        backgroundColor: "#F7F8FA",
        padding: "80px 20px", // 상단, 하단을 크게 늘림
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "18px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px", // 가로폭
          margin: "0 auto",   // 가운데 정렬
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#0064FF",
          }}
        >
          {post.title}
        </h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          작성자: {post.memberName}
        </p>

        <div
          style={{
            borderTop: "1px solid #ddd",
            paddingTop: "20px",
            marginBottom: "20px",
          }}
        >
          <p style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
            {post.content}
          </p>
        </div>

        {/* 첨부 파일 섹션 */}
        {post.attachmentUrls && post.attachmentUrls.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              첨부 파일
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "15px",
              }}
            >
              {post.attachmentUrls.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`첨부 이미지 ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(url, "_blank")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 버튼 그룹 (목록으로 / 수정 / 삭제) */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={() => navigate("/qna")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            목록으로
          </button>
          <button
            onClick={() => navigate(`/qna/update/${id}`)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            수정
          </button>
          <button
            onClick={() => navigate(`/qna/delete/${id}`)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default QnaDetailPage;