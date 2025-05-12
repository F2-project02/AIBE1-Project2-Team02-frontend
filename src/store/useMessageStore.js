import { create } from "zustand";

export const useMessageStore = create((set) => ({
  tab: 0,
  page: 0,
  filter: { filterBy: "nickname", keyword: "" },

  setTab: (tab) => set({ tab }),
  setPage: (page) => set({ page }),
  setFilter: (filter) => set({ filter }),

  selectedMessageIds: [],
  setSelectedMessageIds: (ids) => set({ selectedMessageIds: ids }),
  toggleSelectedMessageId: (id) =>
    set((state) => {
      const exists = state.selectedMessageIds.includes(id);
      const newSelected = exists
        ? state.selectedMessageIds.filter((mid) => mid !== id)
        : [...state.selectedMessageIds, id];
      return { selectedMessageIds: newSelected };
    }),
  clearSelectedMessageIds: () => set({ selectedMessageIds: [] }),
}));
