import type { Book } from '../features/books/types';

export const sampleBook: Book = {
  id: 'book-1', title: 'Lập trình TypeScript', author: 'Nguyễn An',
  category: 'CNTT', year: 2024, availableCopies: 2,
};

export const sampleBooks: Book[] = [
  sampleBook,
  { ...sampleBook, id: 'book-2', title: 'Kinh tế học', category: 'Kinh tế' },
  { ...sampleBook, id: 'book-3', title: 'English Grammar', category: 'Ngoại ngữ' },
  { ...sampleBook, id: 'book-4', title: 'Cấu trúc dữ liệu' },
];
