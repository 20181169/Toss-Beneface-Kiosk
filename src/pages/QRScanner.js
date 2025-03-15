import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// 스타일 정의
const ScannerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

const Heading = styled.h2`
    font-size: 2rem;
    font-weight: bold;
    color: #4A90E2;
    margin-bottom: 20px;
`;

const QRReaderContainer = styled.div`
    width: 100%;
    max-width: 500px;
    height: 500px;
    border: 2px solid #4A90E2;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const ScannedData = styled.div`
    font-size: 1rem;
    color: #333;
    margin-top: 20px;
`;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;

    &:hover {
        background-color: #357ABD;
    }
`;

const QRScanner = () => {
    const [scannedData, setScannedData] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [scanner, setScanner] = useState(null); // 스캐너 상태 관리
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    useEffect(() => {
        initializeScanner();
        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, []);

    // ✅ QR 스캐너 초기화 함수 (중복 실행 방지)
    const initializeScanner = () => {
        if (scanner) {
            scanner.clear();
        }

        const newScanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 500, height: 500 },
        });

        newScanner.render(
            async (decodedText) => {
                setScannedData(decodedText); // 스캔된 데이터 저장
                newScanner.clear(); // 스캔 성공 후 스캐너 중지
                setScanner(null); // 상태 초기화

                // QR 코드 인증 요청 실행
                await authenticateQR(decodedText);
            },
            (error) => {
                console.warn(`QR Scan Error: ${error}`);
            }
        );

        setScanner(newScanner);
    };

    // ✅ QR 코드 인증 API 요청
    const authenticateQR = async (data) => {
        try {
            const [memberId, nonce] = data.split("|"); // "memberId|nonce" 형식 가정

            const response = await fetch(`/api/qr/authenticate?memberId=${memberId}&nonce=${nonce}`);

            if (response.ok) {
                alert("인증 성공! 다음 페이지로 이동합니다.");
                navigate("/CardRecommendation"); // 인증 성공 시 이동
            } else {
                setErrorMessage("인증 실패! 다시 시도하세요.");
            }
        } catch (error) {
            console.error("인증 중 오류 발생:", error);
            setErrorMessage("서버 오류가 발생했습니다.");
        }
    };

    // ✅ 새로고침 버튼 클릭 시 QR 스캐너 다시 실행
    const handleRetry = () => {
        setScannedData(""); // 기존 데이터 초기화
        setErrorMessage(""); // 에러 메시지 초기화
        initializeScanner(); // 스캐너 다시 실행
    };

    return (
        <ScannerWrapper>
            <Heading>QR 코드 스캐너</Heading>
            <QRReaderContainer id="qr-reader"></QRReaderContainer>
            {scannedData && (
                <ScannedData>
                    <h3>스캔된 데이터:</h3>
                    <p>{scannedData}</p>
                </ScannedData>
            )}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {errorMessage && <Button onClick={handleRetry}>다시 시도</Button>}
        </ScannerWrapper>
    );
};

export default QRScanner;
