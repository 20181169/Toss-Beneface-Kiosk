import apiClient from "./apiClient";
import { handleAuthError } from "../utils/errorHandler";

// QnA 게시글 생성
export const createQnaBoard = async (requestDto, files, navigate) => {
    const formData = new FormData();
    formData.append("requestDto", new Blob([JSON.stringify(requestDto)], { type: "application/json" }));
    console.log("Request DTO1:", requestDto);

    // 파일 배열 추가
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }
    
    // FormData 디버깅
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

    try {
        const response = await apiClient.post("/qnaboard/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Request DTO2:", requestDto);    
        return response.data;
    } catch (error) {
        handleAuthError(error, navigate, "게시글 생성 API 호출 중 오류 발생:");
        throw error; // 필요 시 상위 호출 함수에서도 추가 처리 가능
    }
};

// QnA 게시글 목록 가져오기
export const getAllQnaBoards = async (navigate) => {
    try {
        const response = await apiClient.get("/qnaboard");
        return response.data;
    } catch (error) {
        handleAuthError(error, navigate, "QnA 목록 조회 API 호출 중 오류 발생:");
        throw error;
    }
};

// QnA 게시글 상세 조회
export const getQnaBoard = async (qnaBoardId, navigate) => {
    try {
        const response = await apiClient.get(`/qnaboard/${qnaBoardId}`);
        return response.data;
    } catch (error) {
        handleAuthError(error, navigate, "QnA 상세 조회 API 호출 중 오류 발생:");
        throw error;
    }
};

// QnA 게시글 수정
export const updateQnaBoard = async (qnaBoardId, updateRequest, files, navigate) => {
    const formData = new FormData();
    formData.append("requestDto", new Blob([JSON.stringify(updateRequest)], { type: "application/json" }));

    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }

    try {
        const response = await apiClient.put(`/qnaboard/${qnaBoardId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        handleAuthError(error, navigate, "게시글 수정 API 호출 중 오류 발생:");
        throw error;
    }
};

// QnA 게시글 삭제
export const deleteQnaBoard = async (qnaBoardId, navigate) => {
    try {
        await apiClient.delete(`/qnaboard/${qnaBoardId}`);
    } catch (error) {
        handleAuthError(error, navigate, "게시글 삭제 API 호출 중 오류 발생:");
        throw error;
    }
};