import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getBooks } from '../../api/booksApi';
import { isSuccess } from '../../api/types';
import type { Book } from './types';

export interface BooksState {
  items: Book[];
  borrowedIds: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  warning: string | null;
}

const initialState: BooksState = {
  items: [], borrowedIds: [], status: 'idle', error: null, warning: null,
};

export const fetchBooks = createAsyncThunk<Book[], boolean | undefined, { rejectValue: string; state: { books: BooksState } }>(
  'books/fetchBooks',
  async (shouldFail, { rejectWithValue }) => {
    const response = await getBooks(shouldFail);
    return isSuccess(response) ? response.data : rejectWithValue(response.error);
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().books;
      return status === 'idle' || status === 'failed';
    },
  },
);

const booksSlice = createSlice({
  name: 'books', initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<string>) {
      const book = state.items.find((item) => item.id === action.payload);
      if (state.status !== 'succeeded' || !book || book.availableCopies <= 0 || state.borrowedIds.includes(book.id)) return;
      book.availableCopies -= 1;
      state.borrowedIds.push(book.id);
      state.warning = null;
    },
    returnBook(state, action: PayloadAction<string>) {
      const book = state.items.find((item) => item.id === action.payload);
      if (!book || !state.borrowedIds.includes(book.id)) return;
      book.availableCopies += 1;
      state.borrowedIds = state.borrowedIds.filter((id) => id !== book.id);
      state.warning = null;
    },
    setWarning(state, action: PayloadAction<string>) { state.warning = action.payload; },
    clearWarning(state) { state.warning = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Không thể tải danh sách sách.';
      });
  },
});

export const { borrowBook, returnBook, setWarning, clearWarning } = booksSlice.actions;
export default booksSlice.reducer;
