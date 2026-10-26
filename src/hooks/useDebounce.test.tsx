import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('updates only after 300ms and restarts the timer when the value changes', () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: '' } });
  rerender({ value: 'React' });
  act(() => jest.advanceTimersByTime(299));
  expect(result.current).toBe('');
  rerender({ value: 'TypeScript' });
  act(() => jest.advanceTimersByTime(299));
  expect(result.current).toBe('');
  act(() => jest.advanceTimersByTime(1));
  expect(result.current).toBe('TypeScript');
});

test('works with a generic object and clears its timer on unmount', () => {
  const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: { page: 1 } } });
  rerender({ value: { page: 2 } });
  act(() => jest.advanceTimersByTime(300));
  expect(result.current).toEqual({ page: 2 });
  rerender({ value: { page: 3 } });
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});
