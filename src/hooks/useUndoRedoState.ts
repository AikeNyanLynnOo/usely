import { useCallback, useRef, useState } from 'react';

interface UndoRedoActions<T> {
  set: (value: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  reset: (newInitialValue?: T) => void;
  canUndo: boolean;
  canRedo: boolean;
  history: T[];
  future: T[];
}

function useUndoRedoState<T>(initialValue: T): [T, UndoRedoActions<T>] {
  const initialRef = useRef(initialValue);
  const [state, setState] = useState<T>(initialValue);
  const [history, setHistory] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      setHistory(h => [...h, prev]);
      setFuture([]);
      return newValue;
    });
  }, []);

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      setFuture(f => [state, ...f]);
      const prev = h[h.length - 1];
      setState(prev);
      return h.slice(0, -1);
    });
  }, [state]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f;
      setHistory(h => [...h, state]);
      const next = f[0];
      setState(next);
      return f.slice(1);
    });
  }, [state]);

  const reset = useCallback((newInitialValue?: T) => {
    const value = newInitialValue !== undefined ? newInitialValue : initialRef.current;
    initialRef.current = value;
    setState(value);
    setHistory([]);
    setFuture([]);
  }, []);

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  return [state, { set, undo, redo, reset, canUndo, canRedo, history, future }];
}

export default useUndoRedoState; 