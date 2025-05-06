// src/store/useLectureStore.js

import { create } from "zustand";

export const useLectureStore = create((set) => ({
  formData: {
    title: "",
    category: "",
    middleCategory: "",
    subCategory: "",
    categoryId: null,
    price: "",
    description: "",
    curriculum: "",
    timeSlots: [],
    regions: [],
  },

  isLoading: false,
  error: null,

  setFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  setTimeSlots: (timeSlots) =>
    set((state) => ({
      formData: {
        ...state.formData,
        timeSlots,
      },
    })),

  setRegions: (regions) =>
    set((state) => ({
      formData: {
        ...state.formData,
        regions,
      },
    })),

  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  resetFormData: () =>
    set({
      formData: {
        title: "",
        category: "",
        middleCategory: "",
        subCategory: "",
        categoryId: null,
        price: "",
        description: "",
        curriculum: "",
        timeSlots: [],
        regions: [],
      },
      error: null,
    }),
}));
