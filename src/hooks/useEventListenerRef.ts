import { useEffect, useRef, RefCallback } from 'react';

/**
 * useEventListenerRef
 *
 * Attaches an event listener to a DOM element via ref, handling cleanup and updates automatically.
 *
 * @param eventName - The event to listen for (e.g., 'click', 'scroll').
 * @param handler - The event handler function.
 * @param options - Optional event listener options.
 * @returns A ref callback to attach to the target element.
 */
function useEventListenerRef<T extends HTMLElement>(
  eventName: keyof HTMLElementEventMap,
  handler: (event: HTMLElementEventMap[typeof eventName]) => void,
  options?: boolean | AddEventListenerOptions
): RefCallback<T> {
  const savedHandler = useRef<typeof handler>(handler);
  const elementRef = useRef<T | null>(null);

  // Update ref if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as any);
      }
    };
    element.addEventListener(eventName, eventListener, options);
    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, options]);

  // Ref callback to assign the element
  const refCallback: RefCallback<T> = (node) => {
    elementRef.current = node;
  };

  return refCallback;
}

export default useEventListenerRef; 