// src/lib/axiosInstance.js
import axios from "axios";
import { useUserStore } from "../store/useUserStore";

// 환경변수로부터 값 가져오기
const target = import.meta.env.VITE_BACKEND_TARGET; // 'local' or 'prod'
const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
const PROD_API_URL = import.meta.env.VITE_PROD_API_URL;

// 서버 주소 정의 (환경변수 기반)
const SERVER_URLS = {
  local: LOCAL_API_URL,
  prod: PROD_API_URL,
};

// 선택된 서버 주소
const BASE_URL = SERVER_URLS[target] ?? PROD_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// 요청 시 토큰 자동 포함 (선택)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 만료 중복 모달 방지 변수
let isTokenExpiredModalShown = false;

// 에러 응답 로깅
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API 요청 에러:", err);

    // 토큰 만료 확인 (401 Unauthorized)
    if (err.response && err.response.status === 401) {
      const errorData = err.response.data;

      // 디버깅 정보 출력 (문제 진단을 위해)
      console.log("🔍 401 응답 데이터:", errorData);

      // 토큰 만료 감지 - 백엔드 응답 형식에 맞게 조정됨
      // 백엔드의 JwtAuthenticationFilter에서 보내는 응답 형식과 일치
      if (errorData && errorData.error === "token_expired") {
        console.log("🔒 토큰 만료 감지됨");

        // 중복 모달 방지
        if (!isTokenExpiredModalShown) {
          isTokenExpiredModalShown = true;

          // Zustand 스토어에서 logout 함수 호출
          const logout = useUserStore.getState().logout;
          logout(); // 이미 내부에서 localStorage.removeItem("token") 처리됨

          // 토큰 만료 이벤트 발생
          window.dispatchEvent(new CustomEvent("token-expired"));

          // 5초 후 중복 모달 방지 플래그 초기화
          setTimeout(() => {
            isTokenExpiredModalShown = false;
          }, 5000);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
