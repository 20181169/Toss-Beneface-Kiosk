// src/hoc/withAuth.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../auth/authSlice";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const accessToken = useSelector((state) => state.auth.accessToken);
        const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            if (!accessToken) {
                dispatch(refreshAccessToken())
                .unwrap()
                .catch(() => {
                    alert("로그인이 필요합니다.");
                    navigate("/login");
                });
            }
        }, [accessToken, dispatch, navigate]);

        // 아직 인증 상태를 확인 중일 때 로딩 표시
        if (!isAuthenticated && !accessToken) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500 text-lg">인증 상태를 확인 중입니다...</p>
                </div>
            );
        }

        // AccessToken이 있으면 원래 컴포넌트 렌더링
        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
