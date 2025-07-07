// Mock IntersectionObserver must be set before React/hook imports
let mockInstance: MockIntersectionObserver | null = null;

class MockIntersectionObserver {
  callback: (entries: any[], observer: IntersectionObserver) => void;
  options: any;
  observed: Set<Element> = new Set();
  constructor(callback: (entries: any[], observer: IntersectionObserver) => void, options?: any) {
    this.callback = callback;
    this.options = options;
  }
  observe = (el: Element) => {
    this.observed.add(el);
  };
  unobserve = (el: Element) => {
    this.observed.delete(el);
  };
  disconnect = () => {
    this.observed.clear();
  };
  trigger = (isIntersecting: boolean) => {
    this.callback([{ isIntersecting }], this as unknown as IntersectionObserver);
  };
}

(global as any).IntersectionObserver = jest.fn((cb, options) => {
  mockInstance = new MockIntersectionObserver(cb, options);
  return mockInstance as any;
});

import { render, act } from '@testing-library/react';
import React, { useRef } from 'react';
import useVisibilityObserver from '../useVisibilityObserver';

declare global {
  interface Window {
    IntersectionObserver: typeof IntersectionObserver;
  }
}

type IOEntry = Partial<IntersectionObserverEntry> & {
  isIntersecting: boolean;
};

function TestWithOptions() {
  const [_, ref] = useVisibilityObserver({ root: null, rootMargin: '10px', threshold: 0.5 });
  return <div ref={ref} />;
}

function TestCleanup() {
  const [_, ref] = useVisibilityObserver();
  return <div ref={ref} />;
}

describe('useVisibilityObserver', () => {
  afterEach(() => {
    mockInstance = null;
    jest.clearAllMocks();
  });

  it('should detect when element is visible', () => {
    let isVisible: boolean | undefined;
    const Test = () => {
      const [visible, ref] = useVisibilityObserver();
      isVisible = visible;
      return <div ref={ref} data-testid="el" />;
    };
    render(<Test />);
    expect(isVisible).toBe(false);
    act(() => {
      mockInstance!.trigger(true);
    });
    expect(isVisible).toBe(true);
    act(() => {
      mockInstance!.trigger(false);
    });
    expect(isVisible).toBe(false);
  });

  it('should support the once option', () => {
    let isVisible: boolean | undefined;
    const Test = () => {
      const [visible, ref] = useVisibilityObserver({ once: true });
      isVisible = visible;
      return <div ref={ref} data-testid="el" />;
    };
    render(<Test />);
    expect(isVisible).toBe(false);
    act(() => {
      mockInstance!.trigger(true);
    });
    expect(isVisible).toBe(true);
    // Should disconnect after first visible
    expect(mockInstance!.observed.size).toBe(0);
  });

  it('should pass options to IntersectionObserver', () => {
    render(<TestWithOptions />);
    const calls = (window.IntersectionObserver as jest.Mock).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const found = calls.find(call =>
      call[1] &&
      call[1].root === null &&
      call[1].rootMargin === '10px' &&
      call[1].threshold === 0.5
    );
    expect(found).toBeTruthy();
    expect(found[1]).toMatchObject({ root: null, rootMargin: '10px', threshold: 0.5 });
  });

  it('should clean up observer on unmount', () => {
    const { unmount } = render(<TestCleanup />);
    const disconnectSpy = jest.spyOn(mockInstance!, 'disconnect');
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
    disconnectSpy.mockRestore();
  });
}); 