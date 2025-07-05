// Import the necessary functions to test React hooks
import { renderHook, act } from '@testing-library/react';
// Import the custom hook we want to test
import { useDebounceValue } from '../useDebounceValue';

// Tell Jest to use fake timers so we can control time-based behavior in our tests
jest.useFakeTimers();

// Group all tests for the useDebounceValue hook
describe('useDebounceValue', () => {
  // This test checks if the hook correctly debounces value changes
  it('should debounce value changes', () => {
    // Render the hook with an initial value of 'a' and a debounce delay of 500ms
    // result.current gives us the current debounced value
    // rerender lets us simulate changing the input value
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounceValue(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    // At first, the debounced value should be 'a'
    expect(result.current).toBe('a');

    // Simulate changing the value to 'b' (like a user typing)
    rerender({ value: 'b', delay: 500 });
    // The debounced value should still be 'a' immediately after the change
    expect(result.current).toBe('a');

    // Fast-forward time by 500ms to simulate waiting for the debounce delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now, after the delay, the debounced value should update to 'b'
    expect(result.current).toBe('b');
  });
});