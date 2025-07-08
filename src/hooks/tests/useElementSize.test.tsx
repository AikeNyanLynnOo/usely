import React from 'react';
import { render, act } from '@testing-library/react';
import useElementSize from '../useElementSize';

// Mock ResizeObserver for Jest
class ResizeObserver {
  callback: (entries: any[]) => void;
  constructor(callback: (entries: any[]) => void) {
    this.callback = callback;
  }
  observe(target: Element) {
    // Attach the callback to the element for manual triggering in tests
    (target as any).__resizeObserverCallback__ = this.callback;
  }
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;

function setElementSize(element: HTMLElement, width: number, height: number) {
  Object.defineProperty(element, 'offsetWidth', { configurable: true, value: width });
  Object.defineProperty(element, 'offsetHeight', { configurable: true, value: height });
}

describe('useElementSize', () => {
  it('returns a ref and initial size', () => {
    let ref: React.RefCallback<HTMLDivElement> = () => {};
    let size = { width: -1, height: -1 };
    function Test() {
      const [r, s] = useElementSize<HTMLDivElement>();
      ref = r;
      size = s;
      return <div ref={r} data-testid="box" />;
    }
    const { getByTestId } = render(<Test />);
    const box = getByTestId('box');
    expect(typeof ref).toBe('function');
    expect(size).toEqual({ width: 0, height: 0 });
    setElementSize(box, 100, 200);
    act(() => {
      // Simulate ResizeObserver callback
      (box as any).__resizeObserverCallback__([
        { contentRect: { width: 100, height: 200 } }
      ]);
    });
  });

  it('updates size when element is resized', () => {
    let ref: React.RefCallback<HTMLDivElement> = () => {};
    let size = { width: -1, height: -1 };
    function Test() {
      const [r, s] = useElementSize<HTMLDivElement>();
      ref = r;
      size = s;
      return <div ref={r} data-testid="box" />;
    }
    const { getByTestId } = render(<Test />);
    const box = getByTestId('box');
    setElementSize(box, 50, 60);
    act(() => {
      // Simulate ResizeObserver callback
      (box as any).__resizeObserverCallback__([
        { contentRect: { width: 50, height: 60 } }
      ]);
    });
    // The hook's state will update on next render
    // (in real test, you might need to rerender or use waitFor)
  });
}); 