import { RouterProvider } from "react-router-dom";
import root from "./router/root";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "./redux/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 앱 로드 시 AccessToken 갱신 시도
    dispatch(refreshAccessToken());
  }, [dispatch]);

  return <RouterProvider router={root} />;
  // return (
  //   <div>
  //       <h1>QR 코드 스캔 테스트</h1>
  //       <QRScannerComponent />
  //   </div>
// );
}

export default App;
