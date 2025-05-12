// src/store/useTokenExpiredModalStore.js
import { create } from "zustand";

export const useTokenExpiredModalStore = create((set) => ({
  isOpen: false,

  // 모달 열기
  openModal: () => set({ isOpen: true }),

  // 모달 닫기
  closeModal: () => set({ isOpen: false }),
}));
