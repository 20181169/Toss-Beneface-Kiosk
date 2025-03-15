import React from "react";
import { useDispatch } from "react-redux";
import { handleLogout } from "../redux/auth/authActions"; // 로그아웃 처리 함수
import { useNavigate } from "react-router-dom";

const BasicMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        await dispatch(handleLogout());
        navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
    };

    return (
        <nav className="flex justify-between items-center bg-tossBlue text-white p-4">
            <div>
                <span onClick={() => navigate("/")}>홈</span>
            </div>
            <div>
                <button
                    onClick={handleLogoutClick}
                    className="bg-white text-tossBlue px-4 py-2 rounded"
                >
                    로그아웃
                </button>
            </div>
        </nav>
    );
};

export default BasicMenu;
