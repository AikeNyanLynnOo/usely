import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface AsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * useAsync
 *
 * A hook that handles async operations with automatic loading, error, and success states.
 * Provides a clean API for data fetching and other async operations.
 *
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns [execute, state] - Execute function and current state
 */
function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: AsyncOptions = {}
): [
  (...args: any[]) => Promise<T | undefined>,
  AsyncState<T> & { reset: () => void }
] {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Execute the async function
  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await asyncFunction(...args);

        // Only update state if component is still mounted
        if (mountedRef.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          });

          options.onSuccess?.(result);
        }

        return result;
      } catch (error) {
        // Don't update state if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return undefined;
        }

        // Only update state if component is still mounted
        if (mountedRef.current) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          
          setState({
            data: null,
            loading: false,
            error: errorObj,
          });

          options.onError?.(errorObj);
        }

        throw error;
      }
    },
    [asyncFunction, options.onSuccess, options.onError]
  );

  // Execute immediately if requested
  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return [execute, { ...state, reset }];
}

export default useAsync; 