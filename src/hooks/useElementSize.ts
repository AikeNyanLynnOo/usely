import { useCallback, useLayoutEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

function useElementSize<T extends HTMLElement = HTMLElement>(): [React.RefCallback<T>, Size] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRef = useRef<T | null>(null);

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    elementRef.current = node;
    if (node) {
      observerRef.current = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      });
      observerRef.current.observe(node);
      // Set initial size
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    }
  }, []);

  useLayoutEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [ref, size];
}

export default useElementSize; 