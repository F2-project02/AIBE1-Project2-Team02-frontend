// src/store/useLoginModalStore.js

import { create } from "zustand";

export const useLoginModalStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));