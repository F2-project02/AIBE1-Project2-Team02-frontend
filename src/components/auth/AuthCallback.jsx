import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // ✅ 커스텀 훅 불러오기

export default function AuthCallback() {
    const navigate = useNavigate();
    const { fetchUserInfo } = useAuth(); // ✅ 토큰으로 사용자 정보 불러오는 함수
    const [status, setStatus] = useState("처리 중...");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // 토큰 저장
            localStorage.setItem("token", token);

            // 사용자 정보 가져오기
            fetchUserInfo(token)
                .then(() => {
                    setStatus("로그인 성공!");
                    // 잠시 후 홈으로 리다이렉트
                    setTimeout(() => navigate("/"), 1000);
                })
                .catch((error) => {
                    console.error("로그인 중 오류 발생:", error);
                    setStatus("로그인 실패: 사용자 정보를 가져올 수 없습니다");
                    setTimeout(() => navigate("/"), 2000);
                });
        } else {
            // 토큰이 없는 경우
            setStatus("로그인 실패: 토큰이 없습니다");
            setTimeout(() => navigate("/"), 2000);
        }
    }, [navigate, fetchUserInfo]);

    return <div>로그인 처리 중...</div>;
}