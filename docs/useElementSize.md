# useElementSize

A React hook to track the width and height of a DOM element using ResizeObserver.

## API

```ts
const [ref, size] = useElementSize<HTMLElement>();
```
- `ref`: Attach to the element you want to measure.
- `size`: `{ width, height }` (updates on resize)

## Example

```tsx
import useElementSize from 'usely';

function Example() {
  const [ref, size] = useElementSize<HTMLDivElement>();

  return (
    <div>
      <div
        ref={ref}
        style={{ resize: 'both', overflow: 'auto', width: 200, height: 100, border: '1px solid black' }}
      >
        Resize me!
      </div>
      <p>Width: {size.width}px, Height: {size.height}px</p>
    </div>
  );
}
``` 