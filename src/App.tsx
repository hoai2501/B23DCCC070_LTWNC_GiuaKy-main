import { lazy, Suspense, useEffect } from 'react';
import { BookOpen, ChartColumn, Library, Moon, Sun, TriangleAlert, X } from 'lucide-react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useTheme } from './context/ThemeContext';
import { clearWarning, fetchBooks } from './features/books/booksSlice';
import LibraryPage from './features/books/LibraryPage';

const StatsPage = lazy(() => import('./features/stats/StatsPage'));

export default function App() {
  const dispatch = useAppDispatch();
  const { status, error, warning } = useAppSelector((state) => state.books);
  const { theme, toggleTheme } = useTheme();
  const { search } = useLocation();

  useEffect(() => {
    void dispatch(fetchBooks(new URLSearchParams(search).get('apiError') === '1'));
  }, [dispatch, search]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true"><Library size={16} /></span>
            Mini Library
          </Link>
          <nav aria-label="Điều hướng chính">
            <NavLink to="/" end><BookOpen size={16} aria-hidden="true" />Danh sách sách</NavLink>
            <NavLink to="/stats"><ChartColumn size={16} aria-hidden="true" />Thống kê</NavLink>
          </nav>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          >
            {theme === 'light' ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
          </button>
        </div>
      </header>
      <main id="main-content" className="main-content">
        {warning && (
          <div className="warning-banner" role="alert">
            <TriangleAlert size={17} aria-hidden="true" />
            <p>{warning}</p>
            <button className="icon-button icon-button-quiet" onClick={() => dispatch(clearWarning())} aria-label="Đóng cảnh báo">
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        )}
        {(status === 'idle' || status === 'loading') && (
          <div className="state-panel" role="status">
            <span className="loading-bar" aria-hidden="true" />
            <h1>Đang tải...</h1>
          </div>
        )}
        {status === 'failed' && (
          <div className="state-panel">
            <div role="alert">
              <h1>Không thể tải sách</h1>
              <p>{error}</p>
            </div>
            <button className="button" onClick={() => { void dispatch(fetchBooks(false)); }}>Thử lại</button>
          </div>
        )}
        {status === 'succeeded' && (
          <Suspense fallback={<p className="route-loading" role="status">Đang tải...</p>}>
            <Routes>
              <Route path="/" element={<LibraryPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<div className="state-panel"><h1>Không tìm thấy trang</h1><Link className="button" to="/">Về danh sách sách</Link></div>} />
            </Routes>
          </Suspense>
        )}
      </main>
      <footer className="site-footer">
        <span>Mini Library-Ứng dụng tra cứu và mượn/trả sách</span>
        <span>Thư viện khoa</span>
      </footer>
    </div>
  );
}
