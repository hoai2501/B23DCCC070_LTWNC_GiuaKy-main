export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  availableCopies: number;
}

export type BookMetadata = Readonly<Omit<Book, 'availableCopies'>>;
export type CategoryCounts = Record<Category, number>;
