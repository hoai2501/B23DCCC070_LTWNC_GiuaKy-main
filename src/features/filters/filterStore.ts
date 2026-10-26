import { create } from 'zustand';
import type { Category } from '../books/types';

export type CategoryFilter = Category | 'Tất cả';

interface FilterState {
  keyword: string;
  category: CategoryFilter;
  setKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  keyword: '', category: 'Tất cả',
  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
  resetFilters: () => set({ keyword: '', category: 'Tất cả' }),
}));
