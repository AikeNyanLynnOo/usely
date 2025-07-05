import { useEffect, useRef, useState, RefCallback } from 'react';

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
  const [node, setNode] = useState<T | null>(null);

  // Update the handler ref if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  // Attach/detach the event listener when node, eventName, or options change
  useEffect(() => {
    if (!node) return;
    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as any);
      }
    };
    node.addEventListener(eventName, eventListener, options);
    return () => {
      node.removeEventListener(eventName, eventListener, options);
    };
  }, [node, eventName, options]);

  // Ref callback to assign the element and trigger effect
  const refCallback: RefCallback<T> = (el) => {
    setNode(el);
  };

  return refCallback;
}

export default useEventListenerRef; 