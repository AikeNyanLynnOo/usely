import { useEffect, useRef } from "react";

// Types for requestIdleCallback
interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
}

type IdleCallbackHandle = number;
type IdleCallbackOptions = { timeout?: number };
type IdleCallback = (deadline: IdleDeadline) => void;

function useIdleCallback(
  callback: IdleCallback,
  options?: IdleCallbackOptions & { deps?: any[] }
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let handle: IdleCallbackHandle | null = null;
    const run = (deadline: IdleDeadline) => {
      callbackRef.current(deadline);
    };
    if (typeof window !== "undefined" && window.requestIdleCallback) {
      handle = window.requestIdleCallback(run, options);
      return () => {
        if (handle !== null && window.cancelIdleCallback) {
          window.cancelIdleCallback(handle);
        }
      };
    } else {
      // Fallback to setTimeout
      const timeout = options?.timeout ?? 1;
      handle = window.setTimeout(() => {
        run({ didTimeout: false, timeRemaining: () => Math.max(0, 50) });
      }, timeout);
      return () => {
        if (handle !== null) {
          clearTimeout(handle);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, options?.deps ?? []);
}

export default useIdleCallback;
