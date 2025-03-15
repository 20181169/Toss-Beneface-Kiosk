
import { createBrowserRouter } from "react-router-dom";
import LazyLoad from "../components/LazyLoad"; // 공통 LazyLoad 컴포넌트 import
import { lazy } from 'react';
import withAuth from "../redux/hoc/withAuth";

// 페이지 컴포넌트 Lazy 로드
const Main = lazy(() => import("../pages/MainPage"));
const About = lazy(() => import("../pages/AboutPage"));
const Join = lazy(() => import("../pages/JoinPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const Profile = lazy(() => import("../pages/ProfilePage"));
const Logout = lazy(() => import("../pages/LogoutPage"));
const QnaListPage = lazy(() => import("../pages/QnaListPage")); // QnA 목록 페이지
const QnaCreatePage = lazy(() => import("../pages/QnaCreatePage")); // QnA 생성 페이지
const QnaDetailPage = lazy(() => import("../pages/QnaDetailPage")); // QnA 상세 페이지
const QnaUpdatePage = lazy(() => import("../pages/QnaUpdatePage")); // QnA 수정 페이지
const QnaDeletePage = lazy(() => import("../pages/QnaDeletePage")); // QnA 삭제 페이지
const Map = lazy(() => import("../pages/MapPage"));
const Menu = lazy(() => import("../pages/Menu"));
const VisitPage = lazy(() => import("../pages/VisitPage"));
const HollysPage = lazy(() => import("../pages/HollysPage"));
const FaceRecognition = lazy(() => import("../pages/FaceRecognition"));
const SanggunPage = lazy(() => import("../pages/SanggunPage"));
const OwnerPage = lazy(() => import("../pages/OwnerPage"));
const MarketAnalysisPage = lazy(() => import("../pages/MarketAnalysisPage"));
const MarketAnalysisPageBeta = lazy(() => import("../pages/MarketAnalysisPageBeta"));
const FaceUploadForm = lazy(() => import("../pages/FaceUploadForm"));
const CardRecommendation = lazy(() => import("../pages/CardRecommendation"));


const QRScanner = lazy(() => import("../pages/QRScanner"));

const voiceorder = lazy(() => import("../pages/voiceorder"));
const PaymentCheckoutPage = lazy(() => import("../pages/PaymentCheckoutPage"));
const PaymentSuccessPage = lazy(() => import("../pages/PaymentSuccessPage"));

const root = createBrowserRouter([
    // 1. 인증이 필요 없는 페이지
    { path: "/", element: LazyLoad(Main) },
    { path: "about", element: LazyLoad(About) },
    { path: "join", element: LazyLoad(Join) },
    { path: "/login", element: LazyLoad(Login) },
    { path: "logout", element: LazyLoad(Logout) },
    { path: "/payment", element: LazyLoad(PaymentCheckoutPage) },
    { path: "/qrcode/scan", element: LazyLoad(QRScanner) },


    // 2. 인증이 필요한 페이지
    { path: "profile", element: LazyLoad(withAuth(Profile)) },
    { path: "qna", element: LazyLoad(withAuth(QnaListPage)) },
    { path: "qna/create", element: LazyLoad(withAuth(QnaCreatePage))  },
    { path: "qna/:id", element: LazyLoad(withAuth(QnaDetailPage)) },
    { path: "qna/update/:id", element: LazyLoad(withAuth(QnaUpdatePage)) },
    { path: "qna/delete/:id", element: LazyLoad(withAuth(QnaDeletePage)) },
    { path: "/payment/success", element: LazyLoad(withAuth(PaymentSuccessPage)) },

    // 1/2중에 넣기
    { path: "map", element: LazyLoad(Map) },
    { path: "Menu", element: LazyLoad(Menu) },
    { path: "VisitPage", element: LazyLoad(VisitPage) },
    { path: "HollysPage", element: LazyLoad(HollysPage) },
    { path: "FaceRecognition", element: LazyLoad(FaceRecognition) },
    { path: "SanggunPage", element: LazyLoad(SanggunPage) },
    { path: "OwnerPage", element: LazyLoad(OwnerPage) },
    { path: "market-analysis", element: LazyLoad(MarketAnalysisPage) },
    { path: "market-analysis-beta", element: LazyLoad(MarketAnalysisPageBeta) },

    { path: "FaceUploadForm", element: LazyLoad(FaceUploadForm) },
    { path: "CardRecommendation", element: LazyLoad(CardRecommendation) },
    { path: "voiceorder", element: LazyLoad(voiceorder) }
    ]);

export default root;

