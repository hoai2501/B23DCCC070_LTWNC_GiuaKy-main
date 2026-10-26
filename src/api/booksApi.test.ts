import { getBooks } from './booksApi';
import { isSuccess } from './types';
import { createAppStore } from '../app/store';
import { fetchBooks } from '../features/books/booksSlice';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('returns books only after 500ms', async () => {
  let settled = false;
  const request = getBooks().then((response) => { settled = true; return response; });
  await jest.advanceTimersByTimeAsync(499);
  expect(settled).toBe(false);
  await jest.advanceTimersByTimeAsync(1);
  const response = await request;
  expect(isSuccess(response)).toBe(true);
  if (isSuccess(response)) expect(response.data.length).toBeGreaterThan(0);
});

test('failure option reaches the thunk rejected state and can be retried', async () => {
  const store = createAppStore();
  const failed = store.dispatch(fetchBooks(true));
  expect(store.getState().books.status).toBe('loading');
  await jest.advanceTimersByTimeAsync(500);
  await failed;
  expect(store.getState().books.status).toBe('failed');
  expect(store.getState().books.error).toBeTruthy();
  const retried = store.dispatch(fetchBooks(false));
  await jest.advanceTimersByTimeAsync(500);
  await retried;
  expect(store.getState().books.status).toBe('succeeded');
  expect(store.getState().books.error).toBeNull();
});
