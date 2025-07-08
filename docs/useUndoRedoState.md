# useUndoRedoState

A React hook for state management with undo/redo/reset functionality and history/future inspection.

## API

```ts
const [state, { set, undo, redo, reset, canUndo, canRedo, history, future }] = useUndoRedoState<T>(initialValue);
```

- `state`: Current value
- `set(newValue | updaterFn)`: Set a new value (pushes to history)
- `undo()`: Undo last change
- `redo()`: Redo last undone change
- `reset(newInitial?)`: Reset to initial (or provided) value, clearing history
- `canUndo`: Boolean, true if undo is possible
- `canRedo`: Boolean, true if redo is possible
- `history`: Array of past values
- `future`: Array of redoable values

## Example

```tsx
import useUndoRedoState from 'usely';

function Counter() {
  const [count, { set, undo, redo, canUndo, canRedo, reset }] = useUndoRedoState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => set(c => c + 1)}>Increment</button>
      <button onClick={() => set(c => c - 1)}>Decrement</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
}
```

</rewritten_file> 