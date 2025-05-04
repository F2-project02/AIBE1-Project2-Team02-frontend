// src/store/useCourseStore.js

import { create } from "zustand";

export const useCourseStore = create((set) => ({
  // 현재 선택된 카테고리
  selectedCategory: "교육/입시",
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // 강의 목록 상태
  courses: [],
  setCourses: (courses) => set({ courses }),

  // 로딩 상태
  loading: false,
  setLoading: (loading) => set({ loading }),

  // 선택된 필터
  selectedRegion: null,
  setSelectedRegion: (region) => set({ selectedRegion: region }),
}));
