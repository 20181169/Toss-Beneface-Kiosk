import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQnaBoard } from "../api/qnaBoardApi";
import { handleAuthError } from "../utils/errorHandler";

const QnaDeletePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteQnaBoard(id, navigate); // 게시글 삭제 요청
            alert("게시글이 삭제되었습니다.");
            navigate("/qna"); // 삭제 후 목록 페이지로 이동
        } catch (error) {
            handleAuthError(error, navigate, "게시글 삭제 중 오류 발생:");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
            <div
                style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#d9534f" }}>
                    게시글을 삭제하시겠습니까?
                </h2>
                <p style={{ marginTop: "10px", color: "#555" }}>
                    삭제된 게시글은 복구할 수 없습니다. 정말 삭제하시겠습니까?
                </p>

                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        onClick={() => navigate(`/qna/${id}`)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#d9534f",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        삭제하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QnaDeletePage;
