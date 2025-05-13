// src/components/auth/AuthProvider.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoginErrorModal from "./LoginErrorModal";
import TokenExpiredModal from "./TokenExpiredModal";

export default function AuthProvider({ children }) {
  const { checkAuthStatus } = useAuth();
  const location = useLocation();

  // 에러 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 토큰 만료 모달 상태 추가
  const [tokenExpiredModalOpen, setTokenExpiredModalOpen] = useState(false);

  // 자동 로그인 체크
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 소셜 로그인 에러 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get("error");

    if (errorParam) {
      const decodedMessage = decodeURIComponent(errorParam);
      setErrorMessage(decodedMessage);
      setErrorModalOpen(true);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  // 토큰 만료 이벤트 리스너 추가
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log("🔔 토큰 만료 이벤트 감지: 모달 열기");
      setTokenExpiredModalOpen(true);
    };

    // 이벤트 리스너 등록
    window.addEventListener("token-expired", handleTokenExpired);

    // 클린업
    return () => {
      window.removeEventListener("token-expired", handleTokenExpired);
    };
  }, []);

  // 모달 닫기 핸들러
  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  // 토큰 만료 모달 닫기 핸들러 추가
  const handleCloseTokenExpiredModal = () => {
    setTokenExpiredModalOpen(false);
  };

  return (
    <>
      {children}

      {/* 에러 모달 */}
      <LoginErrorModal
        open={errorModalOpen}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />

      {/* 토큰 만료 모달 추가 */}
      <TokenExpiredModal
        open={tokenExpiredModalOpen}
        onClose={handleCloseTokenExpiredModal}
      />
    </>
  );
}
