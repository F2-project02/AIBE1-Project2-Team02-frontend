// src/lib/axiosInstance.js
import axios from "axios";

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

// 에러 응답 로깅
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API 요청 에러:", err);
    return Promise.reject(err);
  }
);

export default axiosInstance;