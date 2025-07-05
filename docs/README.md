# Useful Hooks Documentation

A collection of essential React hooks for common use cases. This library provides hooks that are frequently needed but not always available in popular packages.

## Installation

```bash
npm install useful-hooks
```

## Available Hooks

### State Management
- [useLocalStorage](./useLocalStorage.md) - Persist state in localStorage
- [useDebounceValue](./useDebounceValue.md) - Debounce state updates
- [useDebounceCallback](./useDebounceCallback.md) - Debounce function calls

### DOM & Events
- [useEventListenerRef](./useEventListenerRef.md) - Attach event listeners via ref
- [useClickOutside](./useClickOutside.md) - Detect clicks outside an element

### Async Operations
- [useAsync](./useAsync.md) - Handle async operations with loading/error states

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

## Contributing

Found a bug or have a feature request? Please open an issue or submit a pull request.

## License

MIT 