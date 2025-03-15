import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import * as faceapi from "face-api.js";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
function FaceUploadForm() {
  // 1) 각도 목록
  const angles = ["정면", "왼쪽", "오른쪽", "위", "아래"];
  // 현재 각도 (0 ~ 4)
  const [angleIndex, setAngleIndex] = useState(0);

  // subPhase: "intro" | "detect" | "progress" | "done"
  const [subPhase, setSubPhase] = useState("intro");

  // face-api 모델 로드 여부
  const [modelLoaded, setModelLoaded] = useState(false);

  // 3초 로딩바 진행 (0~100%)
  const [progressValue, setProgressValue] = useState(0);

  // 새로고침 엔드포인트를 한 번만 호출하기 위한 상태
  const [refreshCalled, setRefreshCalled] = useState(false);

  // Webcam ref
  const webcamRef = useRef(null);

  // 카메라 설정
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  const [memberId, setMemberId] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);
  
  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        console.log("decodedToken", decodedToken);
        setMemberId(decodedToken.memberId);
      } catch (error) {
        console.error("JWT 디코딩 실패:", error);
      }
    }
  }, [accessToken]);
  // -------------------------------------------------------------------
  // A. face-api 모델 로드
  // -------------------------------------------------------------------
  useEffect(() => {
    const loadModel = async () => {
      const MODEL_URL = "/models"; // public/models 폴더 내 face-api 모델
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setModelLoaded(true);
      console.log("Face API 모델 로딩 완료");
    };
    loadModel();
  }, []);

  // -------------------------------------------------------------------
  // B. intro 단계에서 3초 후 detect 단계로 전환
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!modelLoaded) return;
    if (subPhase !== "intro") return;

    // 3초 뒤 detect로 전환
    const timer = setTimeout(() => {
      setSubPhase("detect");
    }, 3000);

    return () => clearTimeout(timer);
  }, [modelLoaded, subPhase]);

  // -------------------------------------------------------------------
  // C. subPhase === "detect" 일 때 얼굴 감지 -> progress로 전환
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!modelLoaded) return;
    if (angleIndex >= angles.length) return; // 모든 각도 끝난 경우
    if (subPhase !== "detect") return;

    const detectInterval = setInterval(async () => {
      if (!webcamRef.current) return;
      const video = webcamRef.current.video;
      if (!video) return;

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      // 얼굴이 1개 이상 감지되면 progress로 전환
      if (detections.length > 0) {
        console.log(`[${angles[angleIndex]}] 얼굴 감지! 3초 카운트 시작`);
        setSubPhase("progress");
      }
    }, 500); // 0.5초 간격으로 감지

    return () => clearInterval(detectInterval);
  }, [modelLoaded, subPhase, angleIndex, angles]);

  // -------------------------------------------------------------------
  // D. subPhase === "progress" 일 때 3초 로딩바 진행 후 캡처 & 업로드
  // -------------------------------------------------------------------
  useEffect(() => {
    if (subPhase !== "progress") return;

    setProgressValue(0);
    const startTime = Date.now();
    const duration = 3000; // 3초

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const fraction = elapsed / duration;

      if (fraction >= 1) {
        setProgressValue(100);
        clearInterval(interval);
        // 3초 완료 후 캡처 & 업로드
        doCaptureAndUpload();
      } else {
        setProgressValue(Math.round(fraction * 100));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [subPhase]);

  // -------------------------------------------------------------------
  // E. 캡처 & 업로드
  // -------------------------------------------------------------------
  const doCaptureAndUpload = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      // Base64 → Blob 변환
      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();

      // FormData에 첨부
      const formData = new FormData();
      // formData.append("angle", angles[angleIndex]);
      formData.append("file", blob, `${angles[angleIndex]}.jpg`);
      //formData.append("userName", "민석"); // 서버에서 사용하는 필드명 & 값
      formData.append("memberId", memberId);
      // 실제 서버 API에 맞게 수정
      const res = await axios.post(
        "https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/faces/upload",
        formData
      );
      console.log("업로드 성공:", res.data);
    } catch (err) {
      console.error("업로드 실패:", err);
    }

    // 다음 각도로 넘어가기
    const nextIndex = angleIndex + 1;
    if (nextIndex < angles.length) {
      setAngleIndex(nextIndex);
      setSubPhase("detect"); // 다시 얼굴 감지
    } else {
      // 모든 각도 등록 완료
      setSubPhase("done");
    }
  };

  // -------------------------------------------------------------------
  // F. 모든 각도 등록이 끝난 뒤, 한 번만 Refresh API 호출
  // -------------------------------------------------------------------
  useEffect(() => {
    // 등록 완료 상태
    const doneCondition =
      angleIndex >= angles.length || subPhase === "done";

    // 아직 한 번도 refreshCall을 안 했고, 등록이 모두 끝났다면 호출
    if (!refreshCalled && doneCondition) {
      setRefreshCalled(true); // 중복 방지

      console.log("모든 각도 등록 완료 → Refresh 엔드포인트 호출");
      fetch("https://benefacefastapi20-frgtcya5bnefbdfs.koreacentral-01.azurewebsites.net/fastapi/refresh-faces", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Refresh API 응답:", data);
        })
        .catch((error) => {
          console.error("Refresh API 오류:", error);
        });
    }
  }, [angleIndex, subPhase, refreshCalled, angles.length]);

  // -------------------------------------------------------------------
  // G. 단계별 화면 렌더링
  // -------------------------------------------------------------------

  // (G-1) 모델 로딩 중
  if (!modelLoaded) {
    return (
      <div style={{ textAlign: "center", padding: 30 }}>
        모델 로딩 중...
      </div>
    );
  }

  // (G-2) 모든 각도 완료
  if (angleIndex >= angles.length || subPhase === "done") {
    return (
      <div style={{ textAlign: "center", padding: 30 }}>
        <h1>얼굴 등록이 모두 완료되었습니다!</h1>
      </div>
    );
  }

  // (G-3) 카메라 전체화면 + 상태별 오버레이 UI
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 카메라는 항상 켜둡니다 */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* (G-3-1) intro 단계: 3초 안내 */}
      {subPhase === "intro" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <h1 style={{ marginBottom: 20 }}>잠시 후에 얼굴 등록이 진행됩니다</h1>
          <CircularProgress value={progressValue} />
        </div>
      )}

      {/* (G-3-2) detect/progress 단계 공통 UI */}
      {(subPhase === "detect" || subPhase === "progress") && (
        <>
          {/* 각도 안내 문구 */}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "10px 20px",
              borderRadius: 8,
            }}
          >
            <h1 style={{ margin: 0 }}>
              얼굴 등록 ({angleIndex + 1} / {angles.length})
            </h1>
            <h2 style={{ margin: 0 }}>현재 각도: {angles[angleIndex]}</h2>
          </div>

          {/* 화면 중앙 원형 가이드 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              height: 300,
              border: "4px solid #007bff",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* progress 상태면 원형 로딩바 표시, 아니면 안내 문구 */}
            {subPhase === "progress" ? (
              <CircularProgress value={progressValue} />
            ) : (
              <p style={{ color: "#fff", fontSize: 16 }}>
                얼굴을 원 안에 맞춰주세요
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// 원형 로딩바 컴포넌트
// -------------------------------------------------------------------
function CircularProgress({ value }) {
  // r=80 ⇒ 원둘레: 2πr
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  // 0~100 범위 보정
  const progress = Math.max(0, Math.min(100, value));

  // stroke-dashoffset 계산
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={200} height={200}>
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#ddd"
        strokeWidth="10"
      />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="#007bff"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="100"
        y="110"
        textAnchor="middle"
        fill="#000"
        fontSize="28"
        fontWeight="bold"
      >
        {progress}%
      </text>
    </svg>
  );
}

export default FaceUploadForm;