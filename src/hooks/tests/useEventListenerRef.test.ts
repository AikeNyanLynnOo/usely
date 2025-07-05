// Import utilities for testing hooks and React
import { renderHook, act } from '@testing-library/react';
import React, { useRef } from 'react';
// Import the custom hook to be tested
import useEventListenerRef from '../useEventListenerRef';

describe('useEventListenerRef', () => {
  // Test that the event listener is attached and called
  it('should attach and call event listener', () => {
    // Create a mock function to track event calls
    const handler = jest.fn();
    // Create a ref to a button element
    const button = document.createElement('button');

    // Render the hook to get the ref callback
    const { result } = renderHook(() => useEventListenerRef('click', handler));

    // Attach the ref to the button
    act(() => {
      result.current(button);
    });

    // Simulate a click event
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // The handler should be called once
    expect(handler).toHaveBeenCalledTimes(1);
  });

  // Test that the event listener is removed on unmount
  it('should remove event listener on unmount', () => {
    const handler = jest.fn();
    const button = document.createElement('button');
    const { result, unmount } = renderHook(() => useEventListenerRef('click', handler));
    act(() => {
      result.current(button);
    });

    // Unmount the hook (should remove the event listener)
    unmount();

    // Simulate a click event after unmount
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // The handler should not be called
    expect(handler).not.toHaveBeenCalled();
  });
}); 