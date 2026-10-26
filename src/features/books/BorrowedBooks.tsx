import { BookmarkCheck, BookOpen, Undo2 } from 'lucide-react';
import type { Book } from './types';
import { BORROW_LIMIT } from './borrowLimitMiddleware';

interface BorrowedBooksProps {
  books: Book[];
  onReturn: (id: string) => void;
}

export function BorrowedBooks({ books, onReturn }: BorrowedBooksProps) {
  return (
    <section className="borrowed-panel" aria-labelledby="borrowed-heading">
      <div className="panel-head">
        <h2 id="borrowed-heading" tabIndex={-1}><BookmarkCheck size={17} aria-hidden="true" />Sách đang mượn</h2>
        <span className="count-badge" aria-live="polite">{books.length}/{BORROW_LIMIT}</span>
      </div>
      <progress className="loan-progress" value={books.length} max={BORROW_LIMIT} aria-label="Số cuốn đã mượn trên giới hạn 3 cuốn" />
      {books.length === 0 ? (
        <div className="loans-empty">
          <BookOpen size={22} aria-hidden="true" />
          <p>Chưa có sách đang mượn</p>
        </div>
      ) : (
        <ul className="loan-list">
          {books.map((book) => (
            <li key={book.id}>
              <div className="loan-text">
                <h3>{book.title}</h3>
                <p className="muted">{book.author}</p>
              </div>
              <button className="button button-secondary" onClick={() => onReturn(book.id)}><Undo2 size={15} aria-hidden="true" />Trả</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
