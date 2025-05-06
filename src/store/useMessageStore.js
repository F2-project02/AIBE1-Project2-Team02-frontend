import { create } from "zustand";

export const useMessageStore = create((set) => ({
  tab: 0,
  page: 0,
  filter: { filterBy: "nickname", keyword: "" },

  setTab: (tab) => set({ tab }),
  setPage: (page) => set({ page }),
  setFilter: (filter) => set({ filter }),
}));
