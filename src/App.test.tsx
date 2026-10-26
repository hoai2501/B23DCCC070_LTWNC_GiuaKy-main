import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { createAppStore } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import { useFilterStore } from './features/filters/filterStore';
import { fetchBooks } from './features/books/booksSlice';
import { sampleBooks } from './test/fixtures';

beforeEach(() => {
  useFilterStore.setState({ keyword: '', category: 'Tất cả' });
  localStorage.clear();
});

function renderApp(path = '/', preload = true) {
  const store = createAppStore();
  if (preload) store.dispatch(fetchBooks.fulfilled(sampleBooks, 'request', false));
  render(<Provider store={store}><ThemeProvider><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></ThemeProvider></Provider>);
  return store;
}

test('searches author case-insensitively, combines category filter and shows empty results', async () => {
  renderApp();
  const user = userEvent.setup();
  await user.type(screen.getByRole('searchbox'), 'NGUYỄN AN');
  await waitFor(() => expect(screen.getByText('Đang cập nhật kết quả...')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByText('Đang cập nhật kết quả...')).not.toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: 'Kinh tế' }));
  expect(screen.getByRole('button', { name: 'Kinh tế' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('heading', { name: 'Kinh tế học' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Lập trình TypeScript' })).not.toBeInTheDocument();
  await user.clear(screen.getByRole('searchbox'));
  await user.type(screen.getByRole('searchbox'), 'không tồn tại');
  expect(await screen.findByText('Không tìm thấy sách phù hợp.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Xóa bộ lọc' }));
  expect(await screen.findByRole('heading', { name: 'Lập trình TypeScript' })).toBeInTheDocument();
});

test('search can be cleared without losing the selected category', async () => {
  renderApp();
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'CNTT' }));
  await user.type(screen.getByRole('searchbox'), 'TypeScript');
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Cấu trúc dữ liệu' })).not.toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: 'Xóa tìm kiếm' }));
  expect(screen.getByRole('searchbox')).toHaveValue('');
  expect(await screen.findByRole('heading', { name: 'Cấu trúc dữ liệu' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Kinh tế học' })).not.toBeInTheDocument();
});

test('borrowing, limit warning, returning and lazy statistics share the same state', async () => {
  const store = renderApp();
  const user = userEvent.setup();
  const catalog = screen.getByRole('region', { name: 'Danh sách sách' });
  for (const title of ['Lập trình TypeScript', 'Kinh tế học', 'English Grammar', 'Cấu trúc dữ liệu']) {
    await user.click(within(within(catalog).getByRole('article', { name: title })).getByRole('button', { name: 'Mượn' }));
  }
  expect(screen.getByRole('alert')).toHaveTextContent(/tối đa 3/);
  expect(store.getState().books.borrowedIds).toHaveLength(3);
  const loans = screen.getByRole('region', { name: 'Sách đang mượn' });
  await user.click(within(loans).getAllByRole('button', { name: 'Trả' })[0]);
  expect(store.getState().books.items[0].availableCopies).toBe(2);
  await user.click(screen.getByRole('link', { name: 'Thống kê' }));
  expect(await screen.findByRole('heading', { name: 'Thống kê mượn sách' })).toBeInTheDocument();
  const table = screen.getByRole('table');
  expect(within(table).getByRole('row', { name: 'CNTT 2' })).toBeInTheDocument();
  expect(screen.getByLabelText('Số sách đang mượn')).toHaveTextContent('2');
});

test('theme toggle updates the document and persists the selection', async () => {
  renderApp();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Giao diện tối' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem('mini-library-theme')).toBe('dark');
  expect(screen.getByRole('button', { name: 'Giao diện sáng' })).toBeInTheDocument();
});

test('shows loading, API failure and a working retry', async () => {
  renderApp('/?apiError=1', false);
  expect(screen.getByRole('status')).toHaveTextContent('Đang tải...');
  expect(await screen.findByRole('alert')).toHaveTextContent(/Không thể tải/);
  await userEvent.setup().click(screen.getByRole('button', { name: 'Thử lại' }));
  expect(await screen.findByRole('heading', { name: 'Mã sạch' })).toBeInTheDocument();
});

test('opening /stats directly loads books before showing statistics', async () => {
  renderApp('/stats', false);
  expect(screen.getByRole('status')).toHaveTextContent('Đang tải...');
  expect(await screen.findByRole('heading', { name: 'Thống kê mượn sách' })).toBeInTheDocument();
  expect(screen.getByRole('table')).toBeInTheDocument();
});
