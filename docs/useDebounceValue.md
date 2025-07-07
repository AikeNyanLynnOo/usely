# useDebounceValue

A hook that debounces a value, updating the debounced value only after a specified delay has passed since the last update. Useful for search inputs, API calls, and other scenarios where you want to limit the frequency of updates.

## Installation

```bash
npm install usely
```

## Usage

```tsx
import { useDebounceValue } from 'usely';

const [debouncedValue, setValue] = useDebounceValue(initialValue, delay);
```

## API

### Parameters

- **value** (`T`): The value to debounce
- **delay** (`number`): The delay in milliseconds (default: `500`)

### Returns

- **debouncedValue** (`T`): The debounced value
- **setValue** (`(value: T) => void`): Function to update the value

## Examples

### Search Input

```tsx
import { useDebounceValue } from 'usely';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounceValue('', 300);

  // Update the debounced search term
  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {debouncedSearchTerm && <p>Searching for: {debouncedSearchTerm}</p>}
    </div>
  );
}
```

### API Call Debouncing

```tsx
import { useDebounceValue } from 'usely';
import { useState, useEffect } from 'react';

function UserSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue('', 500);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDebouncedQuery(query);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      fetchUsers(debouncedQuery)
        .then(setUsers)
        .finally(() => setLoading(false));
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      {loading && <div>Loading...</div>}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Form Validation

```tsx
import { useDebounceValue } from 'usely';
import { useState, useEffect } from 'react';

function EmailValidation() {
  const [email, setEmail] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useDebounceValue('', 1000);
  const [isValid, setIsValid] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    setDebouncedEmail(email);
  }, [email]);

  useEffect(() => {
    if (debouncedEmail && debouncedEmail !== email) {
      setValidating(true);
      validateEmail(debouncedEmail)
        .then(setIsValid)
        .finally(() => setValidating(false));
    }
  }, [debouncedEmail]);

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      {validating && <span>Validating...</span>}
      {!validating && debouncedEmail && (
        <span style={{ color: isValid ? 'green' : 'red' }}>
          {isValid ? 'Valid email' : 'Invalid email'}
        </span>
      )}
    </div>
  );
}
```

### Window Resize Handler

```tsx
import { useDebounceValue } from 'usely';
import { useState, useEffect } from 'react';

function ResponsiveComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const [debouncedSize, setDebouncedSize] = useDebounceValue(windowSize, 250);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setDebouncedSize(windowSize);
  }, [windowSize]);

  return (
    <div>
      <p>Current size: {windowSize.width} x {windowSize.height}</p>
      <p>Debounced size: {debouncedSize.width} x {debouncedSize.height}</p>
    </div>
  );
}
```

## Advanced Examples

### Custom Delay Hook

```tsx
import { useDebounceValue } from 'usely';
import { useState } from 'react';

function useSearchDebounce(initialValue = '', delay = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounceValue(initialValue, delay);

  const updateSearch = (value) => {
    setSearchTerm(value);
    setDebouncedSearchTerm(value);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    updateSearch
  };
}

function AdvancedSearch() {
  const { searchTerm, debouncedSearchTerm, updateSearch } = useSearchDebounce('', 500);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder="Search..."
      />
      <p>Typing: {searchTerm}</p>
      <p>Searching: {debouncedSearchTerm}</p>
    </div>
  );
}
```

### Multiple Debounced Values

```tsx
import { useDebounceValue } from 'usely';
import { useState, useEffect } from 'react';

function MultiSearch() {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    price: ''
  });

  const [debouncedName, setDebouncedName] = useDebounceValue('', 300);
  const [debouncedCategory, setDebouncedCategory] = useDebounceValue('', 300);
  const [debouncedPrice, setDebouncedPrice] = useDebounceValue('', 500);

  useEffect(() => {
    setDebouncedName(filters.name);
  }, [filters.name]);

  useEffect(() => {
    setDebouncedCategory(filters.category);
  }, [filters.category]);

  useEffect(() => {
    setDebouncedPrice(filters.price);
  }, [filters.price]);

  useEffect(() => {
    // Perform search with all debounced values
    performSearch({
      name: debouncedName,
      category: debouncedCategory,
      price: debouncedPrice
    });
  }, [debouncedName, debouncedCategory, debouncedPrice]);

  return (
    <div>
      <input
        placeholder="Name"
        value={filters.name}
        onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
      />
      <select
        value={filters.category}
        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <input
        type="number"
        placeholder="Max Price"
        value={filters.price}
        onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
      />
    </div>
  );
}
```

## Features

### Automatic Cleanup
The hook automatically cleans up timers when the component unmounts or when the value changes.

### TypeScript Support
Fully typed with TypeScript generics for type safety.

### Performance Optimized
Uses `useCallback` and `useEffect` efficiently to prevent unnecessary re-renders.

### SSR Safe
Works safely in server-side rendering environments.

## Best Practices

### 1. Choose Appropriate Delays
```tsx
// Short delay for UI responsiveness
const [debouncedValue, setValue] = useDebounceValue('', 100);

// Medium delay for search
const [debouncedSearch, setSearch] = useDebounceValue('', 300);

// Long delay for expensive operations
const [debouncedExpensive, setExpensive] = useDebounceValue('', 1000);
```

### 2. Handle Loading States
```tsx
const [query, setQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useDebounceValue('', 300);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setDebouncedQuery(query);
}, [query]);

useEffect(() => {
  if (debouncedQuery) {
    setLoading(true);
    performSearch(debouncedQuery).finally(() => setLoading(false));
  }
}, [debouncedQuery]);
```

### 3. Avoid Unnecessary Updates
```tsx
// Good - only update when value actually changes
useEffect(() => {
  if (value !== debouncedValue) {
    setDebouncedValue(value);
  }
}, [value]);

// Avoid - updates on every render
setDebouncedValue(value);
```

### 4. Combine with Other Hooks
```tsx
import { useDebounceValue } from 'usely';
import { useLocalStorage } from 'usely';

function PersistentSearch() {
  const [searchTerm, setSearchTerm] = useLocalStorage('search-term', '');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 300);

  useEffect(() => {
    setDebouncedSearch(searchTerm);
  }, [searchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## Common Use Cases

### Search and Filter
```tsx
function SearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 300);

  useEffect(() => {
    setDebouncedSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Form Validation
```tsx
function ValidatedInput() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useDebounceValue('', 500);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setDebouncedValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue) {
      validateField(debouncedValue).then(setIsValid);
    }
  }, [debouncedValue]);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={isValid ? 'valid' : 'invalid'}
      />
      {!isValid && <span>Invalid input</span>}
    </div>
  );
}
```

### Real-time Updates
```tsx
function RealTimeEditor() {
  const [content, setContent] = useState('');
  const [debouncedContent, setDebouncedContent] = useDebounceValue('', 1000);

  useEffect(() => {
    setDebouncedContent(content);
  }, [content]);

  useEffect(() => {
    if (debouncedContent) {
      autoSave(debouncedContent);
    }
  }, [debouncedContent]);

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Start typing..."
    />
  );
}
```

## Limitations

- **Single Value**: Each hook instance handles one value
- **No Immediate Option**: No option to trigger immediately on first call
- **No Cancel Method**: No way to cancel pending debounced updates
- **Memory Usage**: Keeps timer references in memory

## Related Hooks

- [useDebounceCallback](./useDebounceCallback.md) - Debounce function calls instead of values
- [useLocalStorage](./useLocalStorage.md) - Persist debounced values
- [useAsync](./useAsync.md) - Handle async operations with debounced values 