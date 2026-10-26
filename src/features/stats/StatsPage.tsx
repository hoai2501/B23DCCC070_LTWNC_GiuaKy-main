import { useMemo } from 'react';
import { Bookmark, ChartColumn, Layers, Library } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { CATEGORIES, type CategoryCounts } from '../books/types';

export default function StatsPage() {
  const books = useAppSelector((state) => state.books.items);
  const borrowedCount = useAppSelector((state) => state.books.borrowedIds.length);
  const categoryCounts = useMemo(() => books.reduce<CategoryCounts>((counts, book) => {
    counts[book.category] += 1;
    return counts;
  }, { CNTT: 0, 'Kinh tế': 0, 'Ngoại ngữ': 0 }), [books]);

  return (
    <>
      <div className="page-bar">
        <h1>Thống kê mượn sách</h1>
        <dl className="stat-chips">
          <div><dt><Library size={14} aria-hidden="true" />Tổng đầu sách</dt><dd>{books.length}</dd></div>
          <div><dt><Layers size={14} aria-hidden="true" />Thể loại</dt><dd>{CATEGORIES.length}</dd></div>
          <div><dt><Bookmark size={14} aria-hidden="true" />Số sách đang mượn</dt><dd aria-label="Số sách đang mượn">{borrowedCount}</dd></div>
        </dl>
      </div>
      <section className="stats-panel" aria-labelledby="category-stats">
        <h2 id="category-stats"><ChartColumn size={17} aria-hidden="true" />Số đầu sách theo thể loại</h2>
        <table>
          <caption className="sr-only">Số đầu sách của từng thể loại</caption>
          <thead><tr><th scope="col">Thể loại</th><th scope="col">Số đầu sách</th></tr></thead>
          <tbody>{CATEGORIES.map((category) => (
            <tr key={category}>
              <th scope="row"><span className="category-tag" data-category={category}>{category}</span></th>
              <td><div className="stat-value"><span className="stat-track" aria-hidden="true"><span style={{ width: `${books.length ? categoryCounts[category] / books.length * 100 : 0}%` }} /></span><strong>{categoryCounts[category]}</strong></div></td>
            </tr>
          ))}</tbody>
          <tfoot><tr><th scope="row">Tổng cộng</th><td>{books.length}</td></tr></tfoot>
        </table>
      </section>
    </>
  );
}
