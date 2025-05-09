// src/store/useInquiryStore.js
import { create } from "zustand";

const useInquiryStore = create((set) => ({
  // === 기존 상태 ===
  requestedInquiries: [],
  registeredLectures: [],
  loading: false,
  error: null,

  // === 신청자 리스트 상태 ===
  applicants: [],
  applicantsLoading: false,
  applicantsError: null,

  // === 기존 setter ===
  setRequestedInquiries: (data) => set({ requestedInquiries: data }),
  setRegisteredLectures: (data) => set({ registeredLectures: data }),
  setLoading: (flag) => set({ loading: flag }),
  setError: (err) => set({ error: err }),

  // === 신청자 setter ===
  setApplicants: (data) => set({ applicants: data }),
  setApplicantsLoading: (flag) => set({ applicantsLoading: flag }),
  setApplicantsError: (err) => set({ applicantsError: err }),
}));

export default useInquiryStore;
