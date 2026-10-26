import { useCallback, useMemo } from 'react';
import { Bookmark, CircleCheck, Library } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { BookFilters } from '../filters/BookFilters';
import { borrowBook, returnBook } from './booksSlice';
import { BookCard } from './BookCard';
import { BorrowedBooks } from './BorrowedBooks';
import { useBookCatalog } from './useBookCatalog';

export default function LibraryPage() {
  const dispatch = useAppDispatch();
  const { books, filteredBooks, isSearching } = useBookCatalog();
  const borrowedIds = useAppSelector((state) => state.books.borrowedIds);
  const borrowedBooks = useMemo(() => books.filter((book) => borrowedIds.includes(book.id)), [books, borrowedIds]);
  const availableCount = useMemo(() => books.filter((book) => book.availableCopies > 0).length, [books]);
  const handleBorrow = useCallback((id: string) => { dispatch(borrowBook(id)); }, [dispatch]);
  const handleReturn = useCallback((id: string) => { dispatch(returnBook(id)); }, [dispatch]);

  return (
    <>
      <div className="page-bar">
        <h1>Tra cứu sách</h1>
        <dl className="stat-chips">
          <div><dt><Library size={14} aria-hidden="true" />Đầu sách</dt><dd>{books.length}</dd></div>
          <div><dt><CircleCheck size={14} aria-hidden="true" />Có thể mượn</dt><dd>{availableCount}</dd></div>
          <div><dt><Bookmark size={14} aria-hidden="true" />Đang mượn</dt><dd>{borrowedIds.length}</dd></div>
        </dl>
      </div>
      <a className="loans-jump" href="#borrowed-heading"><span>Sách đang mượn</span><span>{borrowedIds.length}/3</span></a>
      <div className="library-layout">
        <section aria-labelledby="catalog-heading" className="catalog">
          <div className="section-heading">
            <h2 id="catalog-heading">Danh sách sách</h2>
            <span className="muted">{filteredBooks.length} đầu sách</span>
          </div>
          <BookFilters />
          <p className="search-status" aria-live="polite">
            {isSearching ? 'Đang cập nhật kết quả...' : ''}
          </p>
          <div className="list-head" aria-hidden="true">
            <span>STT</span><span>Sách</span><span>Thể loại</span><span>Năm</span><span>Tình trạng</span><span />
          </div>
          <div className="book-list" aria-busy={isSearching}>
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} serialNumber={index + 1} isBorrowed={borrowedIds.includes(book.id)} onBorrow={handleBorrow} onReturn={handleReturn} />
            ))}
          </div>
          {filteredBooks.length === 0 && (
            <div className="empty-state"><h3>Không tìm thấy sách phù hợp.</h3></div>
          )}
        </section>
        <BorrowedBooks books={borrowedBooks} onReturn={handleReturn} />
      </div>
    </>
  );
}
