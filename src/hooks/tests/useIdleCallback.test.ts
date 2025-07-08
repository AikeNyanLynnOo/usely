import { renderHook } from '@testing-library/react';
import useIdleCallback from '../useIdleCallback';

describe('useIdleCallback', () => {
  let originalRequestIdleCallback: any;
  let originalCancelIdleCallback: any;
  let originalSetTimeout: any;
  let originalClearTimeout: any;

  beforeEach(() => {
    originalRequestIdleCallback = window.requestIdleCallback;
    originalCancelIdleCallback = window.cancelIdleCallback;
    originalSetTimeout = window.setTimeout;
    originalClearTimeout = window.clearTimeout;
  });

  afterEach(() => {
    window.requestIdleCallback = originalRequestIdleCallback;
    window.cancelIdleCallback = originalCancelIdleCallback;
    window.setTimeout = originalSetTimeout;
    window.clearTimeout = originalClearTimeout;
  });

  it('calls callback using requestIdleCallback', () => {
    const mock = jest.fn();
    let idleCallback: Function = () => {};
    window.requestIdleCallback = (cb: any) => {
      idleCallback = cb;
      return 123;
    };
    window.cancelIdleCallback = jest.fn();
    renderHook(() => useIdleCallback(mock));
    idleCallback({ didTimeout: false, timeRemaining: () => 50 });
    expect(mock).toHaveBeenCalledWith({ didTimeout: false, timeRemaining: expect.any(Function) });
  });

  it('calls callback using setTimeout fallback', () => {
    const mock = jest.fn();
    window.requestIdleCallback = undefined as any;
    window.setTimeout = ((cb: any, timeout?: number) => {
      cb();
      return 456 as any;
    }) as any;
    window.clearTimeout = jest.fn();
    renderHook(() => useIdleCallback(mock));
    expect(mock).toHaveBeenCalledWith({ didTimeout: false, timeRemaining: expect.any(Function) });
  });

  it('cleans up idle callback on unmount', () => {
    window.requestIdleCallback = jest.fn(() => 789);
    const cancel = jest.fn();
    window.cancelIdleCallback = cancel;
    const { unmount } = renderHook(() => useIdleCallback(() => {}));
    unmount();
    expect(cancel).toHaveBeenCalledWith(789);
  });

  it('re-runs callback when deps change', () => {
    const mock = jest.fn();
    let idleCallback: Function = () => {};
    window.requestIdleCallback = (cb: any) => {
      idleCallback = cb;
      return 321;
    };
    window.cancelIdleCallback = jest.fn();
    const { rerender } = renderHook(({ dep }) => useIdleCallback(mock, { deps: [dep] }), { initialProps: { dep: 1 } });
    idleCallback({ didTimeout: false, timeRemaining: () => 50 });
    expect(mock).toHaveBeenCalledTimes(1);
    rerender({ dep: 2 });
    idleCallback({ didTimeout: false, timeRemaining: () => 50 });
    expect(mock).toHaveBeenCalledTimes(2);
  });
}); 