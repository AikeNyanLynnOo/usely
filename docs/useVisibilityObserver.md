# useVisibilityObserver

Detect if an element is visible in the viewport using the IntersectionObserver API.

## Installation

```bash
npm install usely
```

## Import

```tsx
import useVisibilityObserver from 'usely/useVisibilityObserver';
```

## Usage

```tsx
import useVisibilityObserver from 'usely/useVisibilityObserver';

function MyComponent() {
  const [isVisible, ref] = useVisibilityObserver({ threshold: 0.5 });

  return (
    <div ref={ref}>
      {isVisible ? 'I am visible!' : 'Scroll to see me'}
    </div>
  );
}
```

## API

### `const [isVisible, ref] = useVisibilityObserver(options?)`

#### Parameters
- `options` (optional): An object to configure the observer.

#### Options
| Name        | Type                 | Default  | Description                                                                 |
|-------------|----------------------|----------|-----------------------------------------------------------------------------|
| root        | Element \| null       | null     | The ancestor element to use as the viewport. `null` = browser viewport.     |
| rootMargin  | string               | '0px'    | Margin around the root. Accepts CSS margin values.                          |
| threshold   | number \| number[]    | 0        | Percentage of element visibility to trigger (0 = any part visible).         |
| once        | boolean              | false    | If true, stops observing after first visible.                               |

#### Returns
- `isVisible`: `boolean` — Whether the element is currently visible in the viewport.
- `ref`: `React.RefCallback<Element>` — Attach to the element you want to observe.

## Best Practices
- Use for lazy loading images, triggering animations, or analytics when an element enters the viewport.
- For performance, use the `once` option if you only care about the first time an element becomes visible.
- Adjust `threshold` for partial vs. full visibility detection.

## Advanced Usage

### Lazy Loading Example
```tsx
const [isVisible, ref] = useVisibilityObserver({ threshold: 0.1 });
return <img ref={ref} src={isVisible ? 'real.jpg' : 'placeholder.jpg'} alt="" />;
```

### Trigger Animation Once
```tsx
const [isVisible, ref] = useVisibilityObserver({ once: true });
return <div ref={ref} className={isVisible ? 'animate' : ''}>Hello</div>;
```

### Custom Root Example
```tsx
const containerRef = useRef(null);
const [isVisible, ref] = useVisibilityObserver({ root: containerRef.current });
return (
  <div ref={containerRef} style={{ overflow: 'auto', height: 200 }}>
    <div style={{ height: 500 }} />
    <div ref={ref}>Observed element</div>
  </div>
);
```

## FAQ

**Q: Does this work with SSR?**
A: The hook is safe to use in SSR, but IntersectionObserver only works in the browser. The initial value will be `false` until the client mounts.

**Q: Can I observe multiple elements?**
A: This hook is designed for a single element. For multiple, call the hook multiple times or create a custom wrapper.

**Q: Is there a polyfill for older browsers?**
A: Yes, you can use the [intersection-observer polyfill](https://github.com/w3c/IntersectionObserver) if you need to support IE or old Safari/Edge.

## See Also
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [usely documentation](./README.md) 