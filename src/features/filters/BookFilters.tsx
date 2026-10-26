import { Code, Languages, LayoutGrid, RotateCcw, Search, TrendingUp, X, type LucideIcon } from 'lucide-react';
import { CATEGORIES } from '../books/types';
import { useFilterStore, type CategoryFilter } from './filterStore';

const FILTER_ICONS: Record<CategoryFilter, LucideIcon> = {
  'Tất cả': LayoutGrid,
  CNTT: Code,
  'Kinh tế': TrendingUp,
  'Ngoại ngữ': Languages,
};
const options: CategoryFilter[] = ['Tất cả', ...CATEGORIES];

export function BookFilters() {
  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);
  const setKeyword = useFilterStore((state) => state.setKeyword);
  const setCategory = useFilterStore((state) => state.setCategory);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  return (
    <div className="filters">
      <div className="search-field">
        <label className="sr-only" htmlFor="book-search">Tìm kiếm sách</label>
        <Search className="search-icon" size={17} aria-hidden="true" />
        <input id="book-search" type="search" placeholder="Tên sách hoặc tác giả…" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        {keyword && <button className="search-clear" aria-label="Xóa tìm kiếm" onClick={() => setKeyword('')}><X size={15} aria-hidden="true" /></button>}
      </div>
      <div className="filter-bottom">
        <div className="category-options" role="group" aria-label="Thể loại">
          {options.map((option) => {
            const Icon = FILTER_ICONS[option];
            return (
              <button key={option} className="filter-chip" aria-pressed={category === option} onClick={() => setCategory(option)}>
                <Icon size={15} aria-hidden="true" />{option}
              </button>
            );
          })}
        </div>
        {(keyword || category !== 'Tất cả') && (
          <button className="text-button reset-filters" onClick={resetFilters}><RotateCcw size={14} aria-hidden="true" />Xóa bộ lọc</button>
        )}
      </div>
    </div>
  );
}
