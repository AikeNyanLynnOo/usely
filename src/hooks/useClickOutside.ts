import { useEffect, useRef, RefObject } from 'react';

/**
 * useClickOutside
 *
 * A hook that detects clicks outside of a specified element.
 * Useful for closing modals, dropdowns, or any UI that should close when clicking outside.
 *
 * @param ref - Ref object pointing to the element to monitor
 * @param handler - Function to call when a click outside is detected
 * @param enabled - Whether the listener should be active (default: true)
 */
function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (ref.current && ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // Add event listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}

export default useClickOutside; 