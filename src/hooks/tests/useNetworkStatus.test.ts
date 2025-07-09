import { renderHook, act } from '@testing-library/react';
import useNetworkStatus from '../useNetworkStatus';

describe('useNetworkStatus', () => {
  let originalOnLine: any;
  let originalConnection: any;

  beforeEach(() => {
    originalOnLine = Object.getOwnPropertyDescriptor(window.navigator, 'onLine');
    originalConnection = (navigator as any).connection;
  });

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(window.navigator, 'onLine', originalOnLine);
    }
    (navigator as any).connection = originalConnection;
  });

  function setNavigatorOnLine(value: boolean) {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => value,
    });
  }

  it('returns initial online status', () => {
    setNavigatorOnLine(true);
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.online).toBe(true);
  });

  it('updates status on online/offline events', () => {
    setNavigatorOnLine(false);
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.online).toBe(false);
    act(() => {
      setNavigatorOnLine(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.online).toBe(true);
    act(() => {
      setNavigatorOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.online).toBe(false);
  });

  it('includes connection info if available', () => {
    (navigator as any).connection = {
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
      saveData: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.effectiveType).toBe('4g');
    expect(result.current.downlink).toBe(10);
    expect(result.current.rtt).toBe(50);
    expect(result.current.saveData).toBe(false);
  });
}); 