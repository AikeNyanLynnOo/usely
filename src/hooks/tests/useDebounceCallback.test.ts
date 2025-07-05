// Import utilities for testing hooks
import { renderHook, act } from '@testing-library/react';
// Import the custom hook to be tested
import useDebounceCallback from '../useDebounceCallback';

// Enable Jest's fake timers for time-based testing
jest.useFakeTimers();

describe('useDebounceCallback', () => {
  // Test that the debounced callback is only called after the delay
  it('should debounce the callback', () => {
    // Create a mock function to track calls
    const callback = jest.fn();
    // Render the hook to get the debounced function
    const { result } = renderHook(() => useDebounceCallback(callback, 300));

    // Call the debounced function multiple times quickly
    act(() => {
      result.current('a');
      result.current('b');
    });

    // The callback should not be called immediately
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time by 300ms (the debounce delay)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // The callback should be called once, with the last argument
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('b');
  });

  // Test that the callback is not called if unmounted before delay
  it('should not call callback if unmounted before delay', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useDebounceCallback(callback, 200));

    act(() => {
      result.current('x');
    });

    // Unmount before the delay passes
    unmount();
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // The callback should not be called
    expect(callback).not.toHaveBeenCalled();
  });
}); 