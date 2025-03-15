import React, { useCallback, useEffect, useState } from "react";
import { getAllQnaBoards } from "../api/qnaBoardApi";
import { useNavigate } from "react-router-dom";
import { handleAuthError } from "../utils/errorHandler";
import BasicLayout from "../layouts/BasicLayout";

const QnaListPage = () => {
    const [qnaBoards, setQnaBoards] = useState([]);
    const navigate = useNavigate();

    const fetchQnaBoards = useCallback(async () => {
        try {
            const boards = await getAllQnaBoards(navigate);
            setQnaBoards(boards);
        } catch (error) {
            handleAuthError(error, navigate, "QnA 목록을 가져오는 중 오류 발생:");
        }
    }, [navigate]);

    useEffect(() => {
        fetchQnaBoards();
    }, [fetchQnaBoards]);

    return (
        <BasicLayout>
            <div className="p-5 font-sans bg-white shadow rounded-lg max-w-5xl mx-auto">
                {/* 제목 */}
                <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">Q/A 게시판</h1>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-gray-300 text-center">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">글번호</th>
                                <th className="border border-gray-300 px-4 py-2">제목</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qnaBoards.length > 0 ? (
                                qnaBoards.map((board, index) => (
                                    <tr
                                        key={board.id}
                                        onClick={() => navigate(`/qna/${board.id}`)}
                                        className="cursor-pointer hover:bg-blue-50"
                                    >
                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{board.title}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="border border-gray-300 px-4 py-2 text-gray-500">
                                        게시글이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 글쓰기 버튼 */}
                <button
                    onClick={() => navigate("/qna/create")}
                    className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
                >
                    글쓰기
                </button>
            </div>
        </BasicLayout>
    );
};

export default QnaListPage;
