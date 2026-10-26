import { createAppStore } from '../../app/store';
import { borrowBook, returnBook, fetchBooks } from './booksSlice';
import { sampleBooks } from '../../test/fixtures';

test('middleware blocks the fourth loan and allows borrowing after a return', () => {
  const store = createAppStore();
  store.dispatch(fetchBooks.fulfilled(sampleBooks, 'request', false));
  ['book-1', 'book-2', 'book-3', 'book-4'].forEach((id) => store.dispatch(borrowBook(id)));
  expect(store.getState().books.borrowedIds).toEqual(['book-1', 'book-2', 'book-3']);
  expect(store.getState().books.items[3].availableCopies).toBe(2);
  expect(store.getState().books.warning).toMatch(/3/);
  store.dispatch(returnBook('book-2'));
  store.dispatch(borrowBook('book-4'));
  expect(store.getState().books.borrowedIds).toEqual(['book-1', 'book-3', 'book-4']);
  expect(store.getState().books.items[3].availableCopies).toBe(1);
  expect(store.getState().books.warning).toBeNull();
});

test('a second load cannot reset stock while books are borrowed', async () => {
  const store = createAppStore();
  store.dispatch(fetchBooks.fulfilled(sampleBooks, 'request', false));
  store.dispatch(borrowBook('book-1'));
  await store.dispatch(fetchBooks());
  expect(store.getState().books.items[0].availableCopies).toBe(1);
  expect(store.getState().books.borrowedIds).toEqual(['book-1']);
});
