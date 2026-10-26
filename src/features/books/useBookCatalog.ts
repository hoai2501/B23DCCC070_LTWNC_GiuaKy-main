import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useDebounce } from '../../hooks/useDebounce';
import { useFilterStore } from '../filters/filterStore';

export function useBookCatalog() {
  const books = useAppSelector((state) => state.books.items);
  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);
  const debouncedKeyword = useDebounce(keyword, 300);

  const filteredBooks = useMemo(() => {
    const query = debouncedKeyword.trim().toLocaleLowerCase('vi');
    return books.filter((book) => {
      const matchesCategory = category === 'Tất cả' || book.category === category;
      const matchesQuery = book.title.toLocaleLowerCase('vi').includes(query)
        || book.author.toLocaleLowerCase('vi').includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [books, category, debouncedKeyword]);

  return { books, filteredBooks, isSearching: keyword !== debouncedKeyword };
}
