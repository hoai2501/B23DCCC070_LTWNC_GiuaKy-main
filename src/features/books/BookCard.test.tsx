import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './BookCard';
import { sampleBook } from '../../test/fixtures';

test('renders title, author, category, year and remaining copies', () => {
  const { container } = render(<BookCard book={{ ...sampleBook, id: 'it-001' }} isBorrowed={false} onBorrow={jest.fn()} onReturn={jest.fn()} />);
  expect(screen.getByRole('heading', { name: 'Lập trình TypeScript' })).toBeInTheDocument();
  expect(screen.getByText('Nguyễn An')).toBeInTheDocument();
  expect(screen.getByText('CNTT')).toBeInTheDocument();
  expect(screen.getByText(/2024/)).toBeInTheDocument();
  expect(screen.getByText('Còn 2 bản')).toBeInTheDocument();
  expect(container.querySelector('.book-cover')).toHaveAttribute('src', '/book-covers/clean-code.svg');
});

test('uses a unique cover for each seeded book', () => {
  const bookIds = ['it-001', 'it-002', 'it-003', 'eco-001', 'lang-001', 'it-004', 'eco-002', 'lang-002', 'it-005', 'eco-003', 'lang-003', 'eco-004', 'it-006', 'eco-005', 'lang-004', 'it-007', 'eco-006', 'it-008', 'it-009', 'it-010', 'it-011', 'it-012', 'it-013', 'it-014', 'eco-007', 'eco-008', 'eco-009', 'eco-010', 'eco-011', 'eco-012', 'eco-013', 'lang-005', 'lang-006', 'lang-007', 'lang-008', 'lang-009', 'lang-010'];
  const coverPaths = bookIds.map((id) => {
    const { container, unmount } = render(<BookCard book={{ ...sampleBook, id }} isBorrowed={false} onBorrow={jest.fn()} onReturn={jest.fn()} />);
    const coverPath = container.querySelector('.book-cover')?.getAttribute('src');
    unmount();
    return coverPath;
  });

  expect(new Set(coverPaths).size).toBe(bookIds.length);
});

test('clicking borrow calls the handler with the book ID', async () => {
  const onBorrow = jest.fn();
  render(<BookCard book={sampleBook} isBorrowed={false} onBorrow={onBorrow} onReturn={jest.fn()} />);
  await userEvent.setup().click(screen.getByRole('button', { name: 'Mượn' }));
  expect(onBorrow).toHaveBeenCalledTimes(1);
  expect(onBorrow).toHaveBeenCalledWith('book-1');
});

test('borrow is disabled when there are no copies', async () => {
  const onBorrow = jest.fn();
  render(<BookCard book={{ ...sampleBook, availableCopies: 0 }} isBorrowed={false} onBorrow={onBorrow} onReturn={jest.fn()} />);
  const button = screen.getByRole('button', { name: 'Mượn' });
  expect(button).toBeDisabled();
  await userEvent.setup().click(button);
  expect(onBorrow).not.toHaveBeenCalled();
});

test('a borrowed book can still be returned when no copies remain', async () => {
  const onReturn = jest.fn();
  render(<BookCard book={{ ...sampleBook, availableCopies: 0 }} isBorrowed onBorrow={jest.fn()} onReturn={onReturn} />);
  expect(screen.getByText('Bạn đang mượn')).toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Trả' }));
  expect(onReturn).toHaveBeenCalledWith('book-1');
});
