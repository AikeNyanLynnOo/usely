import { useState, useEffect } from "react";

/**
 * useDebounceValue
 *
 * Returns a debounced version of the input value that only updates after the specified delay.
 * Useful for delaying actions like API calls or filtering until the user has stopped typing.
 *
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value, which only updates after the delay has passed without changes.
 */
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}