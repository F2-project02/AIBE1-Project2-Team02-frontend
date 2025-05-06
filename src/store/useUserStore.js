// 📄 src/store/useUserStore.js
import { create } from "zustand";

export const useUserStore = create((set) => ({
  // 테스트용 강제 로그인된 멘토 상태
  isLoggedIn: true,
  userId: 201,
  nickname: "가나다",
  profileImage: "/images/default-profile.svg",
  role: "MENTEE", // MENTOR
  myLectureIds: [1], // 현재 열람 중인 강의 ID 포함

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
  logout: () =>
    set({
      isLoggedIn: false,
      userId: null,
      nickname: "",
      profileImage: "/images/default-profile.svg",
      role: "MENTEE",
      myLectureIds: [],
    }),
}));