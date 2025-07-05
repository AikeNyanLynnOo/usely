# Useful Hooks

A collection of essential React hooks for common use cases. This library provides hooks that are frequently needed but not always available in popular packages.

## Installation

```bash
npm install useful-hooks
```

## Quick Start

```tsx
import { useLocalStorage, useClickOutside, useAsync } from 'useful-hooks';

// Persist user preferences
const [theme, setTheme] = useLocalStorage('theme', 'light');

// Handle clicks outside a modal
const modalRef = useRef();
useClickOutside(modalRef, () => setModalOpen(false));

// Fetch data with loading states
const [fetchData, { data, loading, error }] = useAsync(fetchUserData);
```

## Available Hooks

### State Management
- **useLocalStorage** - Persist state in localStorage with SSR safety
- **useDebounceValue** - Debounce state updates
- **useDebounceCallback** - Debounce function calls

### DOM & Events
- **useEventListenerRef** - Attach event listeners via ref
- **useClickOutside** - Detect clicks outside an element

### Async Operations
- **useAsync** - Handle async operations with loading/error states

## Documentation

📖 **[Full Documentation](https://github.com/AikeNyanLynnOo/usely/blob/main/docs/README.md)** - Complete API reference, examples, and best practices for all hooks.

Each hook has its own detailed documentation page:
- [useLocalStorage](https://github.com/AikeNyanLynnOo/usely/blob/main/docs/useLocalStorage.md)
- [useClickOutside](https://github.com/AikeNyanLynnOo/usely/blob/main/docs/useClickOutside.md)
- [useAsync](https://github.com/AikeNyanLynnOo/usely/blob/main/docs/useAsync.md)
- [useDebounceValue](https://github.com/AikeNyanLynnOo/usely/blob/main/docs/useDebounceValue.md)
- [useDebounceCallback](https://github.com/AikeNyanLynnOo/usely/blob/main/docs/useDebounceCallback.md)
- [useEventListenerRef](https://github.com/AikeNyanLynnOo/usely/blob/main/docs/useEventListenerRef.md)

## Features

- **TypeScript Support** - Fully typed with TypeScript
- **SSR Safe** - Works in server-side rendering environments
- **Performance Optimized** - Minimal re-renders and memory usage
- **Automatic Cleanup** - Proper cleanup on unmount
- **Zero Dependencies** - Only React as a peer dependency

## Contributing

Found a bug or have a feature request? Please open an issue or submit a pull request.

## License

MIT 