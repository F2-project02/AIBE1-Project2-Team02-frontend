import { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";

export default function TestCors() {
  const [message, setMessage] = useState("요청 중...");

  useEffect(() => {
    axiosInstance
      .get("/api/test/hello")
      .then((res) => {
        console.log("✅ 응답 확인:", res.data);
        if (res.data.success) {
          setMessage(res.data.data);
        } else {
          setMessage("❗ 실패: " + (res.data.message || "에러 메시지 없음"));
        }
      })
      .catch((err) => {
        console.error("❌ 요청 실패:", err);
        setMessage("🚫 요청 실패: " + err.message);
      });
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🧪 CORS 테스트</h2>
      <p>응답 메시지: <strong>{message}</strong></p>
    </div>
  );
}