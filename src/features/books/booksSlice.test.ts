import reducer, { borrowBook, returnBook, fetchBooks, type BooksState } from './booksSlice';
import { sampleBooks } from '../../test/fixtures';

const ready = (): BooksState => ({
  items: sampleBooks.map((book) => ({ ...book })), borrowedIds: [],
  status: 'succeeded', error: null, warning: null,
});

test('pending sets loading and clears an earlier error', () => {
  const state = reducer({ ...ready(), error: 'Lỗi cũ' }, fetchBooks.pending('request', false));
  expect(state.status).toBe('loading');
  expect(state.error).toBeNull();
});

test('fulfilled stores the book list', () => {
  const state = reducer(undefined, fetchBooks.fulfilled(sampleBooks, 'request', false));
  expect(state.status).toBe('succeeded');
  expect(state.items).toEqual(sampleBooks);
});

test('rejected stores the API error', () => {
  const state = reducer(undefined, fetchBooks.rejected(null, 'request', true, 'Không tải được sách'));
  expect(state.status).toBe('failed');
  expect(state.error).toBe('Không tải được sách');
});

test('borrowing decrements availability and records the ID without mutating old state', () => {
  const previous = ready();
  const next = reducer(previous, borrowBook('book-1'));
  expect(next.items[0].availableCopies).toBe(1);
  expect(next.borrowedIds).toEqual(['book-1']);
  expect(previous.items[0].availableCopies).toBe(2);
});

test('returning restores one copy and removes the loan', () => {
  const next = reducer(reducer(ready(), borrowBook('book-1')), returnBook('book-1'));
  expect(next.items[0].availableCopies).toBe(2);
  expect(next.borrowedIds).toEqual([]);
});

test('cannot borrow an unavailable or unknown book', () => {
  const previous = ready();
  previous.items[0].availableCopies = 0;
  expect(reducer(previous, borrowBook('book-1'))).toEqual(previous);
  expect(reducer(previous, borrowBook('missing'))).toEqual(previous);
});

test('duplicate borrow or return cannot corrupt the inventory', () => {
  const borrowed = reducer(ready(), borrowBook('book-1'));
  expect(reducer(borrowed, borrowBook('book-1'))).toEqual(borrowed);
  const returned = reducer(borrowed, returnBook('book-1'));
  expect(reducer(returned, returnBook('book-1'))).toEqual(returned);
});
