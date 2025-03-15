import React, { useState, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/voiceorder.css';

function VoiceOrder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [serverResponse, setServerResponse] = useState(null);
  const [assistantText, setAssistantText] = useState('');
  const [orderMenu, setOrderMenu] = useState('');

  const navigate = useNavigate();

  // 브라우저 호환성 확인
  let recognition;
  if ('SpeechRecognition' in window) {
    recognition = new window.SpeechRecognition();
  } else if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
  }

  // SpeechRecognition 설정
  if (recognition) {
    recognition.lang = 'ko-KR';         // 한국어
    recognition.continuous = false;     // 한 번 말하고 멈추는 경우
    recognition.interimResults = false; // 중간결과 미출력
  }

  // 음성 인식 시작
  const startRecording = () => {
    if (!recognition) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }
    setIsRecording(true);
    recognition.start();
  };

  // 음성 인식 정지
  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  // 인식 결과 콜백
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setRecognizedText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  }, [recognition]);

  // FastAPI 서버로 텍스트 보내기
  const sendTextToServer = async () => {
    // sessionStorage에서 matchedBrand 가져오기
    const matchedBrand = sessionStorage.getItem("matchedBrand");

    if (!recognizedText.trim()) {
      alert("전송할 텍스트가 없습니다.");
      return;
    }

    try {
      const response = await fetch("https://benefacespring-cyb3fadahbaqgjbs.koreacentral-01.azurewebsites.net/api/products/voice-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: recognizedText,
          brand: matchedBrand,
        }),
      });

      if (!response.ok) {
        throw new Error(`서버 에러: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("서버 응답:", data);
      setServerResponse(data);

      // 서버 응답의 gpt_answer는 문자열 형태의 JSON이므로 파싱합니다.
      if (data.gpt_answer) {
        try {
          const parsedGpt = JSON.parse(data.gpt_answer);
          setAssistantText(parsedGpt.assistant_text || '');
          setOrderMenu(parsedGpt.menu || '');
        } catch (error) {
          console.error("gpt_answer 파싱 오류:", error);
          setAssistantText('');
          setOrderMenu('');
        }
      }
    } catch (error) {
      console.error("전송 중 오류:", error);
    }
  };

  // 주문하기 버튼 클릭 시 /menu 페이지로 이동, gpt_answer의 menu 값을 state로 전달
  const handleOrder = () => {
    if (!orderMenu) {
      alert("주문할 메뉴 정보가 없습니다.");
      return;
    }
    navigate("/menu", { state: { menu: orderMenu } });
  };

  return (
    <div className="voice-order-container">
      {/* 상단 상태 표시줄(예시) */}
      <div className="status-bar">
        <span className="time">12:00</span>
        <div className="status-icons">
          <span className="wifi-icon">📶</span>
          <span className="battery-icon">🔋</span>
        </div>
      </div>

      {/* 사이드 메뉴 버튼(햄버거 아이콘)과 페이지 타이틀 */}
      <div className="header">
        <div className="menu-icon">≡</div>
        <h2>Voice Search</h2>
      </div>

      {/* "Speak now" 버튼 */}
      {!isRecording ? (
        <button className="speak-now-btn" onClick={startRecording}>
          Speak now
        </button>
      ) : (
        <button className="speak-now-btn" onClick={stopRecording}>
          Stop
        </button>
      )}

      {/* 마이크 아이콘 + 원형 효과 */}
      <div className="microphone-container">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <FaMicrophone className="microphone-icon" />
      </div>

      {/* 아래쪽 정보 아이콘 */}
      <div className="info-button">i</div>

      {/* 인식된 텍스트 */}
      <div style={{ marginTop: '40px', color: '#fff' }}>
        <h3>인식된 텍스트</h3>
        <p>{recognizedText}</p>
      </div>

      {/* 서버 전송 버튼 */}
      <button onClick={sendTextToServer} style={{ marginTop: '20px' }}>
        Send to Server
      </button>

      {/* 서버 응답 출력 (assistant_text 표시) */}
      {assistantText && (
        <div style={{ marginTop: '20px', color: '#fff' }}>
          <h3>서버 응답</h3>
          <p>{assistantText}</p>
          <button 
            onClick={handleOrder} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            주문하기
          </button>
        </div>
      )}
    </div>
  );
}

export default VoiceOrder;