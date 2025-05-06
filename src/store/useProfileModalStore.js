// src/store/useProfileModalStore.js
import { create } from "zustand";

export const useProfileModalStore = create((set) => ({
  isOpen: false,
  profileData: null,
  openModal: (data) => set({ isOpen: true, profileData: data }),
  closeModal: () => set({ isOpen: false, profileData: null }),
}));
