// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage 사용
import authReducer from "./auth/authSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["accessToken", "isAuthenticated"], // 유지할 상태 정의
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedReducer,
    },
    devTools: process.env.NODE_ENV !== "production", // 개발 모드에서 DevTools 활성화
});

export const persistor = persistStore(store);
export default store;