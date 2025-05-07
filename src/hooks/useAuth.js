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

        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const loginWindow = window.open(
            `${base}/oauth2/authorization/${provider}`,
            "_blank",
            `width=${width}, height=${height}, left=${left}, top=${top}`
        );

        const receiveToken = (event) => {
            const backendOrigin = new URL(
                import.meta.env.VITE_BACKEND_TARGET === "local"
                    ? import.meta.env.VITE_LOCAL_API_URL
                    : import.meta.env.VITE_PROD_API_URL
            ).origin;

            const allowedOrigins = [
                window.location.origin,
                backendOrigin
            ];

            if (import.meta.env.DEV) {
                console.log("토큰 수신됨");
            }

            if (!allowedOrigins.includes(event.origin)) {
                console.warn("허용하지 않은 origin");
                return;
            }

            const {token} = event.data;
            if (token) {
                localStorage.setItem("token", token);

                if (import.meta.env.DEV) {
                    console.log("토큰 저장 완료");
                }

                fetchUserInfo(token);

                loginWindow.close();
                window.removeEventListener("message", receiveToken);
                close();
            }
        };

        window.addEventListener("message", receiveToken);
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
        checkAuthStatus
    };
}