// src/components/auth/AuthProvider.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoginErrorModal from "./LoginErrorModal";

export default function AuthProvider({ children }) {
  const { checkAuthStatus } = useAuth();
  const location = useLocation();

  // 에러 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // 모달 닫기 핸들러
  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
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
    </>
  );
}
