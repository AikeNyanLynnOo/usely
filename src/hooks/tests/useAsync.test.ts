import { renderHook, act } from '@testing-library/react';
import useAsync from '../useAsync';

describe('useAsync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const asyncFunction = jest.fn();
    const { result } = renderHook(() => useAsync(asyncFunction));

    expect(result.current[1]).toEqual({
      data: null,
      loading: false,
      error: null,
      reset: expect.any(Function),
    });
  });

  it('should execute async function and update state', async () => {
    const mockData = { id: 1, name: 'Test' };
    const asyncFunction = jest.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useAsync(asyncFunction));

    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]();
    });

    // Should be loading
    expect(result.current[1].loading).toBe(true);
    expect(result.current[1].data).toBe(null);
    expect(result.current[1].error).toBe(null);

    await act(async () => {
      await promise;
    });

    // Should have data
    expect(result.current[1].loading).toBe(false);
    expect(result.current[1].data).toEqual(mockData);
    expect(result.current[1].error).toBe(null);
    expect(asyncFunction).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Test error');
    const asyncFunction = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useAsync(asyncFunction));

    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]();
    });

    // Should be loading
    expect(result.current[1].loading).toBe(true);

    await act(async () => {
      try {
        await promise;
      } catch (error) {
        // Expected to throw
      }
    });

    // Should have error
    expect(result.current[1].loading).toBe(false);
    expect(result.current[1].data).toBe(null);
    expect(result.current[1].error).toEqual(mockError);
  });

  it('should call onSuccess callback when successful', async () => {
    const mockData = { id: 1, name: 'Test' };
    const asyncFunction = jest.fn().mockResolvedValue(mockData);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useAsync(asyncFunction, { onSuccess }));

    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]();
    });

    await act(async () => {
      await promise;
    });

    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it('should call onError callback when error occurs', async () => {
    const mockError = new Error('Test error');
    const asyncFunction = jest.fn().mockRejectedValue(mockError);
    const onError = jest.fn();
    const { result } = renderHook(() => useAsync(asyncFunction, { onError }));

    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]();
    });

    await act(async () => {
      try {
        await promise;
      } catch (error) {
        // Expected to throw
      }
    });

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should execute immediately when immediate option is true', async () => {
    const mockData = { id: 1, name: 'Test' };
    const asyncFunction = jest.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useAsync(asyncFunction, { immediate: true }));

    // Should start loading immediately
    expect(result.current[1].loading).toBe(true);

    // Wait for the async operation to complete
    await act(async () => {
      // Wait a bit for the async operation
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[1].data).toEqual(mockData);
    expect(asyncFunction).toHaveBeenCalledTimes(1);
  });

  it('should reset state when reset is called', async () => {
    const mockData = { id: 1, name: 'Test' };
    const asyncFunction = jest.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useAsync(asyncFunction));

    // Execute and wait for completion
    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]();
    });

    await act(async () => {
      await promise;
    });

    // Should have data
    expect(result.current[1].data).toEqual(mockData);

    // Reset
    act(() => {
      result.current[1].reset();
    });

    // Should be back to initial state
    expect(result.current[1]).toEqual({
      data: null,
      loading: false,
      error: null,
      reset: expect.any(Function),
    });
  });

  it('should cancel previous request when new request is made', async () => {
    const asyncFunction = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('delayed'), 100))
    );
    const { result } = renderHook(() => useAsync(asyncFunction));

    // Start first request
    let promise1: Promise<any>;
    act(() => {
      promise1 = result.current[0]();
    });

    // Start second request immediately (should cancel first)
    let promise2: Promise<any>;
    act(() => {
      promise2 = result.current[0]();
    });

    await act(async () => {
      await promise2;
    });

    // Only the second request should complete
    expect(asyncFunction).toHaveBeenCalledTimes(2);
  });

  it('should not update state if component is unmounted', async () => {
    const mockData = { id: 1, name: 'Test' };
    const asyncFunction = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockData), 100))
    );
    const { result, unmount } = renderHook(() => useAsync(asyncFunction));

    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]();
    });

    // Unmount before async operation completes
    unmount();

    await act(async () => {
      await promise;
    });

    // State should not be updated after unmount
    expect(result.current[1].data).toBe(null);
  });

  it('should handle non-Error objects thrown', async () => {
    const asyncFunction = jest.fn().mockRejectedValue('String error');
    const { result } = renderHook(() => useAsync(asyncFunction));

    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]();
    });

    await act(async () => {
      try {
        await promise;
      } catch (error) {
        // Expected to throw
      }
    });

    // Should convert to Error object
    expect(result.current[1].error).toBeInstanceOf(Error);
    expect(result.current[1].error?.message).toBe('String error');
  });

  it('should pass arguments to async function', async () => {
    const asyncFunction = jest.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useAsync(asyncFunction));

    let promise: Promise<any>;
    act(() => {
      promise = result.current[0]('arg1', 'arg2', { key: 'value' });
    });

    await act(async () => {
      await promise;
    });

    expect(asyncFunction).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
  });

  it('should return the result from execute function', async () => {
    const mockData = { id: 1, name: 'Test' };
    const asyncFunction = jest.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useAsync(asyncFunction));

    let executeResult: any;
    act(() => {
      executeResult = result.current[0]();
    });

    await act(async () => {
      executeResult = await executeResult;
    });

    expect(executeResult).toEqual(mockData);
  });
}); 