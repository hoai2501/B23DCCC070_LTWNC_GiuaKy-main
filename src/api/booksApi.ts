import type { Book } from '../features/books/types';
import type { ApiResponse } from './types';
import { bookSeed } from './bookSeed';

export function getBooks(shouldFail = false): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shouldFail
        ? { ok: false, error: 'Không thể tải danh sách sách. Vui lòng thử lại.' }
        : { ok: true, data: bookSeed.map((book) => ({ ...book })) });
    }, 500);
  });
}
