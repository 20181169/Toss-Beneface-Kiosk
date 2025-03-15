import React from "react";
import BasicLayout from "../layouts/BasicLayout";

function MainPage() {
    return (
        <BasicLayout>
            <h1 style={{
                textAlign: "center",
                fontSize: "36px",
                color: "#0064FF",
                fontWeight: "bold",
            }}>
                환영합니다!
            </h1>
        </BasicLayout>
    );
}


export default MainPage;
