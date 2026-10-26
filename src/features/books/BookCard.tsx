import { memo, useId } from 'react';
import { BookMarked, BookPlus, CircleCheck, CircleX, Undo2 } from 'lucide-react';
import type { Book } from './types';

interface BookCardProps {
  book: Book;
  serialNumber?: number;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

const BOOK_COVERS: Record<string, string> = {
  'it-001': '/book-covers/clean-code.svg',
  'it-002': '/book-covers/typescript.svg',
  'it-003': '/book-covers/design-patterns.svg',
  'eco-001': '/book-covers/economics-principles.svg',
  'lang-001': '/book-covers/english-grammar.svg',
  'it-004': '/book-covers/javascript.svg',
  'eco-002': '/book-covers/lean-startup.svg',
  'lang-002': '/book-covers/oxford-words.svg',
  'it-005': '/book-covers/algorithms.svg',
  'eco-003': '/book-covers/marketing.svg',
  'lang-003': '/book-covers/ielts-vocabulary.svg',
  'eco-004': '/book-covers/fast-slow-thinking.svg',
  'it-006': '/book-covers/python-basics.svg',
  'eco-005': '/book-covers/personal-finance.svg',
  'lang-004': '/book-covers/english-speaking.svg',
  'it-007': '/book-covers/databases.svg',
  'eco-006': '/book-covers/business-creativity.svg',
  'it-008': '/book-covers/cybersecurity.svg',
  'it-009': '/book-covers/web-design.svg',
  'it-010': '/book-covers/mobile-apps.svg',
  'it-011': '/book-covers/artificial-intelligence.svg',
  'it-012': '/book-covers/software-development.svg',
  'it-013': '/book-covers/computer-networks.svg',
  'it-014': '/book-covers/sql-data-analysis.svg',
  'eco-007': '/book-covers/corporate-finance.svg',
  'eco-008': '/book-covers/digital-business.svg',
  'eco-009': '/book-covers/negotiation.svg',
  'eco-010': '/book-covers/human-resources.svg',
  'eco-011': '/book-covers/entrepreneurship.svg',
  'eco-012': '/book-covers/brand-customers.svg',
  'eco-013': '/book-covers/green-economy.svg',
  'lang-005': '/book-covers/everyday-english.svg',
  'lang-006': '/book-covers/japanese-vocabulary.svg',
  'lang-007': '/book-covers/korean-grammar.svg',
  'lang-008': '/book-covers/english-listening.svg',
  'lang-009': '/book-covers/chinese-beginners.svg',
  'lang-010': '/book-covers/academic-writing.svg',
};

export const BookCard = memo(function BookCard({ book, serialNumber, isBorrowed, onBorrow, onReturn }: BookCardProps) {
  const titleId = useId();
  const available = book.availableCopies > 0;

  return (
    <article className="book-row" data-category={book.category} data-borrowed={isBorrowed} aria-labelledby={titleId}>
      {serialNumber !== undefined && <span className="row-number" aria-label={`Số thứ tự ${serialNumber}`}>{serialNumber}</span>}
      <div className="row-main">
        <img className="book-cover" src={BOOK_COVERS[book.id] ?? '/book-covers/default.svg'} alt="" aria-hidden="true" />
        <div className="row-text">
          <h3 id={titleId}>{book.title}</h3>
          <p className="book-author">{book.author}</p>
        </div>
      </div>
      <span className="category-tag" data-category={book.category}>{book.category}</span>
      <span className="book-year">{book.year}</span>
      <span className={`availability${available ? '' : ' unavailable'}`}>
        {available ? <CircleCheck size={14} aria-hidden="true" /> : <CircleX size={14} aria-hidden="true" />}
        {available ? `Còn ${book.availableCopies} bản` : 'Hết bản'}
      </span>
      <div className="row-action">
        {isBorrowed && <span className="borrowed-label"><BookMarked size={13} aria-hidden="true" />Bạn đang mượn</span>}
        {isBorrowed
          ? <button className="button button-secondary" onClick={() => onReturn(book.id)}><Undo2 size={15} aria-hidden="true" />Trả</button>
          : <button className="button" disabled={!available} onClick={() => onBorrow(book.id)}><BookPlus size={15} aria-hidden="true" />Mượn</button>}
      </div>
    </article>
  );
});
