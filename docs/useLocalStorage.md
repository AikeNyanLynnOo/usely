# useLocalStorage

A hook that persists state in localStorage with automatic serialization/deserialization. Handles SSR safely and provides error handling for localStorage access.

## Installation

```bash
npm install useful-hooks
```

## Usage

```tsx
import { useLocalStorage } from 'useful-hooks';

const [value, setValue, removeValue] = useLocalStorage('key', initialValue);
```

## API

### Parameters

- **key** (`string`): The localStorage key to use
- **initialValue** (`T`): The initial value if no value exists in localStorage

### Returns

- **value** (`T`): Current value from localStorage or initial value
- **setValue** (`(value: T | ((prev: T) => T)) => void`): Function to update the value (works like useState)
- **removeValue** (`() => void`): Function to remove the value from localStorage

## Examples

### Basic Usage

```tsx
import { useLocalStorage } from 'useful-hooks';

function UserProfile() {
  const [name, setName, removeName] = useLocalStorage('user-name', 'Guest');
  
  return (
    <div>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Enter your name"
      />
      <button onClick={() => setName('Guest')}>Reset</button>
      <button onClick={removeName}>Clear</button>
    </div>
  );
}
```

### Complex Objects

```tsx
import { useLocalStorage } from 'useful-hooks';

function Settings() {
  const [settings, setSettings] = useLocalStorage('app-settings', {
    theme: 'light',
    language: 'en',
    notifications: true
  });

  const updateTheme = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  return (
    <div>
      <select value={settings.theme} onChange={(e) => updateTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

### Function Updates (like useState)

```tsx
import { useLocalStorage } from 'useful-hooks';

function Counter() {
  const [count, setCount] = useLocalStorage('counter', 0);
  
  const increment = () => {
    setCount(prev => prev + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## Features

### SSR Safe
The hook works safely in server-side rendering environments by checking for `window` availability.

### Error Handling
Gracefully handles localStorage errors (quota exceeded, private browsing, etc.) with console warnings.

### Cross-Tab Synchronization
Automatically syncs changes across browser tabs/windows using the `storage` event.

### TypeScript Support
Fully typed with TypeScript generics for type safety.

## Best Practices

### 1. Use Descriptive Keys
```tsx
// Good
const [theme, setTheme] = useLocalStorage('app-theme', 'light');

// Avoid
const [theme, setTheme] = useLocalStorage('t', 'light');
```

### 2. Handle Complex State Updates
```tsx
const [user, setUser] = useLocalStorage('user', { name: '', email: '' });

// Update specific fields
const updateName = (name) => {
  setUser(prev => ({ ...prev, name }));
};
```

### 3. Clean Up When Needed
```tsx
const [token, setToken, removeToken] = useLocalStorage('auth-token', null);

const logout = () => {
  removeToken(); // Removes from localStorage and resets to initial value
};
```

## Limitations

- **Storage Limits**: localStorage has size limits (usually 5-10MB)
- **Synchronous**: All operations are synchronous
- **String Storage**: Values are serialized to JSON strings
- **Same-Origin**: Only accessible from the same origin

## Migration from Manual localStorage

### Before
```tsx
const [name, setName] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('name')) || 'Guest';
  } catch {
    return 'Guest';
  }
});

const updateName = (newName) => {
  setName(newName);
  try {
    localStorage.setItem('name', JSON.stringify(newName));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};
```

### After
```tsx
const [name, setName] = useLocalStorage('name', 'Guest');
```

## Related Hooks

- [useSessionStorage](./useSessionStorage.md) - Similar hook for sessionStorage
- [useDebounceValue](./useDebounceValue.md) - Debounce localStorage updates 