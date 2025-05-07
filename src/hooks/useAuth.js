import { useLoginModalStore } from "../store/useLoginModalStore";
import { useUserStore } from "../store/useUserStore";

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
   * 소셜 로그인 창 열고, 로그인 완료 후 토큰 수신 처리
   * @param {string} provider - "kakao" 또는 "google"
   */
  const handleSocialLogin = (provider) => {
    const base = getBaseUrl();

    // 팝업 창 크기 및 위치 설정 (가운데 정렬)
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // 로그인 팝업 창 열기
    const loginWindow = window.open(
      `${base}/oauth2/authorization/${provider}`,
      "_blank",
      `width=${width}, height=${height}, left=${left}, top=${top}`
    );

    /**
     * postMessage 이벤트 리스너 (백엔드에서 토큰 수신)
     */
    const handleMessage = (event) => {
      const backendOrigin = new URL(getBaseUrl()).origin;
      const allowedOrigins = [window.location.origin, backendOrigin];

      // 보안 체크: 허용된 origin만 처리
      if (!allowedOrigins.includes(event.origin)) {
        console.warn("🚫 허용되지 않은 origin:", event.origin);
        return;
      }

      const { token } = event.data;

      // 토큰 유효성 검사
      if (!token || typeof token !== "string") {
        console.warn("❗ 유효하지 않은 토큰 형식 수신:", event.data);
        return;
      }

      // 토큰 저장 및 사용자 정보 조회
      localStorage.setItem("token", token);
      import.meta.env.DEV && console.log("✅ 토큰 저장 완료");

      fetchUserInfo(token);

      // 로그인 창 닫기 및 리스너 제거
      loginWindow.close();
      window.removeEventListener("message", handleMessage);
      close(); // 모달 닫기
    };

    // 이벤트 리스너 등록
    window.addEventListener("message", handleMessage);
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

      if (result.success && result.data) {
        // Zustand를 통해 로그인 상태 업데이트
        useUserStore.getState().login({
          userId: result.data.userId,
          nickname: result.data.nickname,
          profileImage: result.data.profileImage,
          role: result.data.role || "MENTEE",
          myLectureIds: [], // 필요 시 강의 ID fetch 추가
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
    const token = localStorage.getItem("token");
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

      if (result.success && result.data) {
        useUserStore.getState().login({
          userId: result.data.userId,
          nickname: result.data.nickname,
          profileImage: result.data.profileImage,
          role: result.data.role || "MENTEE",
          myLectureIds: [],
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
  };
}