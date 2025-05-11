// src/hooks/useAuth.js

import {useLoginModalStore} from "../store/useLoginModalStore";
import {useUserStore} from "../store/useUserStore";


/**
 * useAuth 훅
 * - 소셜 로그인 창 열기
 * - 백엔드로부터 토큰 수신
 * - 사용자 정보를 가져와 전역 상태 저장
 * - 자동 로그인 상태 확인
 */
export default function useAuth() {
    const { close } = useLoginModalStore();

    /**
     * 현재 환경(local/prod)에 맞는 API Base URL 반환
     */
    const getBaseUrl = () =>
        import.meta.env.VITE_BACKEND_TARGET === "local"
            ? import.meta.env.VITE_LOCAL_API_URL
            : import.meta.env.VITE_PROD_API_URL;


    /**
     * 소셜 로그인 리다이렉트 시작
     * @param {string} provider - "kakao" 또는 "google"
     */
    const handleSocialLogin = (provider) => {
        const base = getBaseUrl();

        console.log("로그인");
        console.log(provider);

        window.location.href = `${base}/oauth2/authorization/${provider}`;
    };


    /**
     * access token을 이용해 사용자 정보 조회 → 전역 상태 저장
     * @param {string} token - access token
     */
    const fetchUserInfo = async (token) => {
        try {
            const base = getBaseUrl();

            const response = await fetch(`${base}/api/account/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error("❌ 사용자 정보 요청 실패:", response.status);
                return;
            }

            const result = await response.json();

            const responseLec = await fetch(`${base}/api/account/mylecture`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!responseLec.ok) {
                console.error("❌ 수강 중인 강의 정보 요청 실패:", responseLec.status);
                return;
            }

            const resultLec = await responseLec.json();

            if (result.success && result.data && resultLec.success && resultLec.data) {
                // Zustand를 통해 로그인 상태 업데이트
                useUserStore.getState().login({
                    userId: result.data.userId,
                    nickname: result.data.nickname,
                    profileImage: result.data.profileImage,
                    role: result.data.role || "MENTEE",
                    myLectureIds: resultLec.data.lectureIds,
                });

                import.meta.env.DEV && console.log("🙆 사용자 정보 수신 완료");
            }
        } catch (err) {
            console.error("❌ 사용자 정보 요청 에러:", err);
        }
    };


    /**
     * 앱 첫 진입 시(localStorage에 토큰 있으면) 자동 로그인 처리
     */
    const checkAuthStatus = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        // URL에 토큰이 있으면 저장하고 URL에서 제거
        if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl);
            // 토큰 파라미터 제거 (브라우저 히스토리에 토큰이 남지 않도록)
            window.history.replaceState({}, document.title, window.location.pathname);
            // 사용자 정보 가져오기
            await fetchUserInfo(tokenFromUrl);
            return; // 토큰을 처리했으므로 여기서 종료
        }

        // 로컬 스토리지에서 토큰 확인 (자동 로그인)
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const base = getBaseUrl();

            const response = await fetch(`${base}/api/account/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                localStorage.removeItem("token");
                return;
            }

            const result = await response.json();

            const responseLec = await fetch(`${base}/api/account/mylecture`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!responseLec.ok) {
                console.error("❌ 수강 중인 강의 정보 요청 실패:", responseLec.status);
                return;
            }

            const resultLec = await responseLec.json();

            if (result.success && result.data && resultLec.success && resultLec.data) {
                useUserStore.getState().login({
                    userId: result.data.userId,
                    nickname: result.data.nickname,
                    profileImage: result.data.profileImage,
                    role: result.data.role || "MENTEE",
                    myLectureIds: resultLec.data.lectureIds,
                });

                import.meta.env.DEV && console.log("🔁 자동 로그인 성공");
            } else {
                localStorage.removeItem("token");
            }
        } catch (err) {
            localStorage.removeItem("token");
            console.error("❌ 자동 로그인 오류:", err);
        }
    };

    return {
        handleSocialLogin,
        checkAuthStatus,
        fetchUserInfo,
    };
}