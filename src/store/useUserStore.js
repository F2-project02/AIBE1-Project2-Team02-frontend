// src/store/useUserStore.js

import { create } from "zustand";

export const useUserStore = create((set) => ({
  isLoggedIn: false,
  profileImage: "/images/default-profile.svg", // 기본값
  login: (imageUrl) =>
    set({ isLoggedIn: true, profileImage: imageUrl || "/images/default-profile.svg" }),
  logout: () => set({ isLoggedIn: false, profileImage: "/images/default-profile.svg" }),
}));
