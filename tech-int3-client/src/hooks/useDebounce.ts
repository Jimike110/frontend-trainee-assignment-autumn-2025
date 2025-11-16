import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value. It's useful for delaying
 * expensive operations like API calls until the user has stopped typing.
 *
 * @template T The type of the value to be debounced.
 * @param {T} value The value to debounce (e.g., a search term).
 * @param {number} delay The debounce delay in milliseconds (e.g., 500).
 * @returns {T} The debounced value, which updates only after the delay has passed.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
