# useIdleCallback

A React hook to schedule a callback during browser idle time using requestIdleCallback, with a setTimeout fallback.

## API

```ts
useIdleCallback(callback, options?)
```
- `callback`: Function to run when the browser is idle. Receives an IdleDeadline argument.
- `options`: `{ timeout?: number, deps?: any[] }` (optional)

## Example

```tsx
import useIdleCallback from 'usely';

function Example() {
  useIdleCallback(() => {
    console.log('Browser is idle!');
  });

  return <div>Check the console when the browser is idle.</div>;
} 