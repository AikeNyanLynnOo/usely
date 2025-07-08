import { renderHook, act } from '@testing-library/react';
import useUndoRedoState from '../useUndoRedoState';

describe('useUndoRedoState', () => {
  it('should initialize with initial value', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    expect(result.current[0]).toBe(0);
    expect(result.current[1].canUndo).toBe(false);
    expect(result.current[1].canRedo).toBe(false);
  });

  it('should set value and allow undo', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].set(1));
    expect(result.current[0]).toBe(1);
    expect(result.current[1].canUndo).toBe(true);
    expect(result.current[1].canRedo).toBe(false);
  });

  it('should undo and redo value', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].set(1));
    act(() => result.current[1].set(2));
    expect(result.current[0]).toBe(2);
    act(() => result.current[1].undo());
    expect(result.current[0]).toBe(1);
    expect(result.current[1].canUndo).toBe(true);
    expect(result.current[1].canRedo).toBe(true);
    act(() => result.current[1].redo());
    expect(result.current[0]).toBe(2);
  });

  it('should not undo past initial value', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].undo());
    expect(result.current[0]).toBe(0);
    expect(result.current[1].canUndo).toBe(false);
  });

  it('should clear future on new set after undo', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].set(1));
    act(() => result.current[1].set(2));
    act(() => result.current[1].undo());
    expect(result.current[0]).toBe(1);
    act(() => result.current[1].set(3));
    expect(result.current[0]).toBe(3);
    expect(result.current[1].canRedo).toBe(false);
  });

  it('should reset to initial value and clear history/future', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].set(1));
    act(() => result.current[1].set(2));
    act(() => result.current[1].reset());
    expect(result.current[0]).toBe(0);
    expect(result.current[1].canUndo).toBe(false);
    expect(result.current[1].canRedo).toBe(false);
  });

  it('should reset to new value and clear history/future', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].set(1));
    act(() => result.current[1].reset(5));
    expect(result.current[0]).toBe(5);
    expect(result.current[1].canUndo).toBe(false);
    expect(result.current[1].canRedo).toBe(false);
  });

  it('should support functional set', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].set(v => v + 1));
    expect(result.current[0]).toBe(1);
    act(() => result.current[1].set(v => v * 2));
    expect(result.current[0]).toBe(2);
  });

  it('should expose history and future arrays', () => {
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => result.current[1].set(1));
    act(() => result.current[1].set(2));
    act(() => result.current[1].undo());
    expect(result.current[1].history).toEqual([0]);
    expect(result.current[1].future).toEqual([2]);
  });
}); 