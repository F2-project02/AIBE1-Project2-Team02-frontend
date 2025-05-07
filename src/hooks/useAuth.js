// src/hooks/useAuth.js

import {useLoginModalStore} from "../store/useLoginModalStore";
import {useUserStore} from "../store/useUserStore";

export default function useAuth() {
    const { close } = useLoginModalStore();

    const handleSocialLogin = (provider) => {
        const base =
            import.meta.env.VITE_BACKEND_TARGET === "local"
                ? import.meta.env.VITE_LOCAL_API_URL
                : import.meta.env.VITE_PROD_API_URL;
        console.log("로그인");
        console.log(provider);
        window.location.href = `${base}/oauth2/authorization/${provider}`;
    };

    const fetchUserInfo = async (token) => {
        try {
            const base = import.meta.env.VITE_BACKEND_TARGET === "local"
                ? import.meta.env.VITE_LOCAL_API_URL
                : import.meta.env.VITE_PROD_API_URL;

            const response = await fetch(
                `${base}/api/account/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.ok) {
                const result = await response.json();

                if (import.meta.env.DEV) {
                    console.log("사용자 정보 수신됨");
                }

                if (result.success && result.data) {
                    useUserStore.getState().login({
                        userId: result.data.userId,
                        nickname: result.data.nickname,
                        profileImage: result.data.profileImage,
                        role: result.data.role || "MENTEE",
                        myLectureIds: []
                    });
                }
            } else {
                console.error("사용자 정보 가져오기 실패", response.status);
            }
        } catch (error) {
            console.error("사용자 정보 가져오기 오류: ", error);
        }
    };

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
        const token = localStorage.getItem('token');

        if (!token) return;

        try {
            const base = import.meta.env.VITE_BACKEND_TARGET === "local"
                ? import.meta.env.VITE_LOCAL_API_URL
                : import.meta.env.VITE_PROD_API_URL;

            const response = await fetch(`${base}/api/account/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await  response.json();

                if (result.success && result.data) {
                    useUserStore.getState().login({
                        userId: result.data.userId,
                        nickname: result.data.nickname,
                        profileImage: result.data.profileImage,
                        role: result.data.role || "MENTEE",
                        myLectureIds: []
                    });

                    if (import.meta.env.DEV) {
                        console.log("자동 로그인 성공");
                    }
                }
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            localStorage.removeItem('token');
        }
    };

    return {
        handleSocialLogin,
        checkAuthStatus,
        fetchUserInfo
    };
}