// 📄 src/store/useUserStore.js
import { create } from "zustand";

export const useUserStore = create((set) => ({
  isLoggedIn: false,
  userId: null,
  nickname: "",
  profileImage: "/images/default-profile.svg",
  role: "MENTEE", // 기본값
  myLectureIds: [],

  // 로그인 처리
  login: ({ userId, nickname, profileImage, role, myLectureIds }) =>
    set({
      isLoggedIn: true,
      userId,
      nickname,
      profileImage: profileImage || "/images/default-profile.svg",
      role,
      myLectureIds,
    }),

  // 로그아웃 처리
  logout: () => {
    localStorage.removeItem("token");
    set({
      isLoggedIn: false,
      userId: null,
      nickname: "",
      profileImage: "/images/default-profile.svg",
      role: "MENTEE",
      myLectureIds: [],
    });
  },
}));
