// src/lib/api/profileApi.js

// 백엔드 서버 URL 가져오기
const getBaseUrl = () => {
  return import.meta.env.VITE_BACKEND_TARGET === "local"
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;
};

// 프로필 정보 가져오기
export const fetchProfileData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/account/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("프로필 정보를 가져오는데 실패했습니다");
  }

  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || "프로필 조회 실패");
  }
};

// 멘토 프로필 가져오기
export const fetchMentorProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const baseUrl = getBaseUrl();
  console.log("API 호출 URL:", `${baseUrl}/api/account/mentor/profile`);

  try {
    const response = await fetch(`${baseUrl}/api/account/mentor/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`요청 실패: ${response.status}`);
    }

    const result = await response.json();
    console.log("API 응답 결과:", result);

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "멘토 프로필 조회 실패");
    }
  } catch (error) {
    console.error("멘토 프로필 API 오류:", error);
    throw error;
  }
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const baseUrl = getBaseUrl();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${baseUrl}/api/account/profile/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다");
  }

  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || "이미지 업로드 실패");
  }
};

// 닉네임 중복 확인
export const checkNickname = async (nickname) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const baseUrl = getBaseUrl();

  const response = await fetch(
    `${baseUrl}/api/account/check-nickname?nickname=${encodeURIComponent(
      nickname
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("닉네임 확인에 실패했습니다");
  }

  const result = await response.json();

  if (result.success) {
    return result.data; // true면 사용 가능, false면 중복
  } else {
    throw new Error(result.message || "닉네임 확인 실패");
  }
};

// 프로필 업데이트
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/account/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("프로필 정보 업데이트에 실패했습니다");
  }

  const result = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || "프로필 업데이트 실패");
  }
};

// 멘토 프로필 업데이트 API
export const updateMentorProfile = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/account/mentor/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // FormData 객체 직접 전달
  });

  if (!response.ok) {
    throw new Error("멘토 프로필 업데이트 요청이 실패했습니다");
  }

  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || "멘토 프로필 업데이트 실패");
  }
};

// 회원 탈퇴 API
export const deleteAccount = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/account/profile`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("회원 탈퇴 요청이 실패했습니다");
  }

  const result = await response.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || "회원 탈퇴 실패");
  }
};
