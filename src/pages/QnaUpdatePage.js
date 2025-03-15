import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQnaBoard, updateQnaBoard } from "../api/qnaBoardApi";
import { handleAuthError } from "../utils/errorHandler";

const QnaUpdatePage = () => {
    const { id } = useParams(); // URL에서 게시글 ID 가져오기
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [existingFiles, setExistingFiles] = useState([]); // 기존 첨부 파일
    const [newFiles, setNewFiles] = useState([]); // 새로 첨부할 파일
    const [isUpdating, setIsUpdating] = useState(false);

    // 기존 게시글 데이터를 가져오는 함수
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getQnaBoard(id, navigate);
                setTitle(post.title);
                setContent(post.content);
                setExistingFiles(post.attachmentUrls || []);
            } catch (error) {
                handleAuthError(error, navigate, "게시글을 불러오는 중 오류 발생:");
            }
        };

        fetchPost();
    }, [id, navigate]);

    const handleUpdate = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const requestDto = {
            title,
            content,
        };

        try {
            setIsUpdating(true);
            await updateQnaBoard(id, requestDto, newFiles, navigate); // 새 파일로 기존 파일 덮어쓰기
            alert("게시글이 수정되었습니다.");
            navigate("/qna"); // 수정 후 목록 페이지로 이동
        } catch (error) {
            // 이미 handleAuthError에서 처리
        } finally {
            setIsUpdating(false);
        }
    };

    // 기존 파일 삭제
    const handleRemoveFile = (index) => {
        setExistingFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                maxWidth: "800px",
                margin: "0 auto",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h1 style={{ color: "#0064FF", marginBottom: "20px" }}>게시글 수정</h1>
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                    }}
                />
                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        width: "100%",
                        height: "150px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        marginBottom: "10px",
                    }}
                />
            </div>

            {/* 기존 첨부 파일 */}
            {existingFiles.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                    <h3>기존 첨부 파일</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {existingFiles.map((fileUrl, index) => (
                            <li key={index} style={{ marginBottom: "5px" }}>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    {fileUrl}
                                </a>
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    style={{
                                        marginLeft: "10px",
                                        color: "red",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 새 파일 업로드 */}
            <input
                type="file"
                multiple
                onChange={(e) => setNewFiles(Array.from(e.target.files))}
                style={{ marginBottom: "10px" }}
            />

            <button
                onClick={handleUpdate}
                disabled={isUpdating}
                style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: isUpdating ? "gray" : "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                }}
            >
                {isUpdating ? "수정 중..." : "수정 완료"}
            </button>
            <button
                onClick={() => navigate("/qna")}
                style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                    backgroundColor: "lightgray",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                취소
            </button>
        </div>
    );
};

export default QnaUpdatePage;
