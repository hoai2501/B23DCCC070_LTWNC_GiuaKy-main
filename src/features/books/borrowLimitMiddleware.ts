import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setWarning, type BooksState } from './booksSlice';

export const BORROW_LIMIT = 3;
export const borrowLimitMiddleware: Middleware<object, { books: BooksState }> = (store) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const { items, borrowedIds, status } = store.getState().books;
    const book = items.find((item) => item.id === action.payload);
    const canBorrow = status === 'succeeded' && book && book.availableCopies > 0 && !borrowedIds.includes(book.id);
    if (canBorrow && borrowedIds.length >= BORROW_LIMIT) {
      store.dispatch(setWarning(`Bạn chỉ được mượn tối đa ${BORROW_LIMIT} cuốn cùng lúc. Hãy trả sách trước khi mượn thêm.`));
      return;
    }
  }
  return next(action);
};
