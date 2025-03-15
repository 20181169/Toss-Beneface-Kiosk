export const handleAuthError = (error, navigate, customMessage) => {
    if (error.response?.status === 401) {
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login"); // 또는 다른 페이지로 리다이렉트
    } else {
        console.error(customMessage, error);
    }
};