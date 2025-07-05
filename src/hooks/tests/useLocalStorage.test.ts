import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    // Reset the mock implementation to ensure clean state
    localStorageMock.getItem.mockImplementation((key: string) => {
      const store = (localStorageMock as any)._store || {};
      return store[key] || null;
    });
    localStorageMock.setItem.mockImplementation((key: string, value: string) => {
      if (!(localStorageMock as any)._store) {
        (localStorageMock as any)._store = {};
      }
      (localStorageMock as any)._store[key] = value;
    });
    localStorageMock.removeItem.mockImplementation((key: string) => {
      if ((localStorageMock as any)._store) {
        delete (localStorageMock as any)._store[key];
      }
    });
    localStorageMock.clear.mockImplementation(() => {
      (localStorageMock as any)._store = {};
    });
  });

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('initial-value');
  });

  it('should load existing value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('"stored-value"');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
  });

  it('should handle function updates like useState', () => {
    const { result } = renderHook(() => useLocalStorage('function-test-key', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('function-test-key', '1');
  });

  it('should remove value from localStorage when removeValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[2](); // removeValue
    });
    
    expect(result.current[0]).toBe('initial-value');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle complex objects', () => {
    const complexObject = { name: 'John', age: 30, hobbies: ['reading', 'gaming'] };
    const { result } = renderHook(() => useLocalStorage('test-key', complexObject));
    
    act(() => {
      result.current[1]({ ...complexObject, age: 31 });
    });
    
    expect(result.current[0]).toEqual({ name: 'John', age: 31, hobbies: ['reading', 'gaming'] });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify({ name: 'John', age: 31, hobbies: ['reading', 'gaming'] }));
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage quota exceeded');
    });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Error setting localStorage key "test-key":', expect.any(Error));
    expect(result.current[0]).toBe('new-value'); // State should still update
    
    consoleSpy.mockRestore();
  });

  it('should handle JSON parse errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    
    // Suppress console.warn during this test
    const originalWarn = console.warn;
    console.warn = jest.fn();
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('initial-value');
    expect(console.warn).toHaveBeenCalledWith('Error reading localStorage key "test-key":', expect.any(Error));
    
    // Restore console.warn
    console.warn = originalWarn;
  });

  it('should listen for storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: '"updated-from-other-tab"',
        oldValue: null,
      });
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('updated-from-other-tab');
  });

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[1]('set-value');
    });
    
    // Simulate storage event for different key
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'different-key',
        newValue: '"different-value"',
        oldValue: null,
      });
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('set-value'); // Should not change
  });
}); 