import { useCallback, useRef, useState, useEffect, RefCallback } from 'react';

export interface UseVisibilityObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean; // If true, stops observing after first visible
}

/**
 * useVisibilityObserver
 *
 * @param options IntersectionObserver options
 * @returns [isVisible, ref]
 */
function useVisibilityObserver<T extends Element = Element>(
  options: UseVisibilityObserverOptions = {}
): [boolean, RefCallback<T>] {
  const { root = null, rootMargin = '0px', threshold = 0, once = false } = options;
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<T | null>(null);

  const cleanup = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  };

  const ref = useCallback((node: T | null) => {
    cleanup();
    elementRef.current = node;
    if (node) {
      observerRef.current = new window.IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
          if (once && entry.isIntersecting) {
            cleanup();
          }
        },
        { root, rootMargin, threshold }
      );
      observerRef.current.observe(node);
    }
  }, [root, rootMargin, threshold, once]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return [isVisible, ref];
}

export default useVisibilityObserver; 