import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store"; // Store와 Persistor import
import { PersistGate } from "redux-persist/integration/react"; // PersistGate 추가
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      {/* PersistGate로 App을 감싸서 상태를 동기화 */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();
