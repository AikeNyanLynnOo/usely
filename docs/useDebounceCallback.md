# useDebounceCallback

A hook that creates a debounced version of a callback function. The debounced function will only execute after a specified delay has passed since the last call. Useful for handling frequent events like scroll, resize, or input changes.

## Installation

```bash
npm install usely
```

## Usage

```tsx
import { useDebounceCallback } from 'usely';

const debouncedCallback = useDebounceCallback(callback, delay);
```

## API

### Parameters

- **callback** (`(...args: any[]) => void`): The function to debounce
- **delay** (`number`): The delay in milliseconds (default: `500`)

### Returns

- **debouncedCallback** (`(...args: any[]) => void`): The debounced version of the callback

## Examples

### Search Input with Debounced API Call

```tsx
import { useDebounceCallback } from 'usely';
import { useState } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const debouncedSearch = useDebounceCallback(async (query) => {
    if (query.trim()) {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    } else {
      setResults([]);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Window Resize Handler

```tsx
import { useDebounceCallback } from 'usely';
import { useState, useEffect } from 'react';

function ResponsiveComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const debouncedResizeHandler = useDebounceCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, 250);

  useEffect(() => {
    window.addEventListener('resize', debouncedResizeHandler);
    return () => window.removeEventListener('resize', debouncedResizeHandler);
  }, [debouncedResizeHandler]);

  return (
    <div>
      <p>Window size: {windowSize.width} x {windowSize.height}</p>
    </div>
  );
}
```

### Form Submission with Validation

```tsx
import { useDebounceCallback } from 'usely';
import { useState } from 'react';

function FormComponent() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const debouncedValidate = useDebounceCallback(async (field, value) => {
    if (field === 'email') {
      const isValid = await validateEmail(value);
      setErrors(prev => ({
        ...prev,
        email: isValid ? null : 'Invalid email format'
      }));
    }
  }, 500);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    debouncedValidate(field, value);
  };

  return (
    <form>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        placeholder="Password"
      />
    </form>
  );
}
```

### Scroll Event Handler

```tsx
import { useDebounceCallback } from 'usely';
import { useEffect } from 'react';

function ScrollComponent() {
  const debouncedScrollHandler = useDebounceCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      // Show back to top button
      document.getElementById('back-to-top').style.display = 'block';
    } else {
      // Hide back to top button
      document.getElementById('back-to-top').style.display = 'none';
    }
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', debouncedScrollHandler);
    return () => window.removeEventListener('scroll', debouncedScrollHandler);
  }, [debouncedScrollHandler]);

  return (
    <div>
      <div style={{ height: '2000px' }}>
        Scroll down to see the effect
      </div>
      <button id="back-to-top" style={{ display: 'none' }}>
        Back to Top
      </button>
    </div>
  );
}
```

## Advanced Examples

### Custom Hook with Debounced Callback

```tsx
import { useDebounceCallback } from 'usely';
import { useState, useEffect } from 'react';

function useDebouncedSearch(delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounceCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, delay);

  const handleSearch = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return {
    searchTerm,
    results,
    loading,
    handleSearch
  };
}

function AdvancedSearch() {
  const { searchTerm, results, loading, handleSearch } = useDebouncedSearch(500);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Multiple Debounced Callbacks

```tsx
import { useDebounceCallback } from 'usely';
import { useState, useEffect } from 'react';

function MultiHandlerComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const debouncedMouseMove = useDebounceCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, 100);

  const debouncedResize = useDebounceCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, 250);

  useEffect(() => {
    window.addEventListener('mousemove', debouncedMouseMove);
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('mousemove', debouncedMouseMove);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [debouncedMouseMove, debouncedResize]);

  return (
    <div>
      <p>Mouse position: {position.x}, {position.y}</p>
      <p>Window size: {size.width} x {size.height}</p>
    </div>
  );
}
```

### Conditional Debouncing

```tsx
import { useDebounceCallback } from 'usely';
import { useState, useCallback } from 'react';

function ConditionalDebounce() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [count, setCount] = useState(0);

  const debouncedIncrement = useDebounceCallback(() => {
    setCount(prev => prev + 1);
  }, 1000);

  const handleClick = useCallback(() => {
    if (isEnabled) {
      debouncedIncrement();
    } else {
      setCount(prev => prev + 1);
    }
  }, [isEnabled, debouncedIncrement]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
        Enable debouncing
      </label>
      <button onClick={handleClick}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
}
```

### API Call with Retry

```tsx
import { useDebounceCallback } from 'usely';
import { useState } from 'react';

function ApiCallWithRetry() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const debouncedApiCall = useDebounceCallback(async (id, retryCount = 0) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/data/${id}`);
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      setData(result);
    } catch (error) {
      if (retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        setTimeout(() => debouncedApiCall(id, retryCount + 1), 1000);
      } else {
        console.error('Max retries reached:', error);
      }
    } finally {
      setLoading(false);
    }
  }, 500);

  return (
    <div>
      <button onClick={() => debouncedApiCall('123')}>
        Fetch Data
      </button>
      {loading && <div>Loading...</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

## Features

### Automatic Cleanup
The hook automatically cleans up timers when the component unmounts or when the callback changes.

### Stable Reference
The debounced callback maintains a stable reference across re-renders, preventing unnecessary effect re-runs.

### TypeScript Support
Fully typed with TypeScript for type safety.

### Performance Optimized
Uses `useCallback` internally to prevent unnecessary re-creations.

### SSR Safe
Works safely in server-side rendering environments.

## Best Practices

### 1. Use Appropriate Delays
```tsx
// Short delay for UI responsiveness
const debouncedHandler = useDebounceCallback(handler, 100);

// Medium delay for search
const debouncedSearch = useDebounceCallback(search, 300);

// Long delay for expensive operations
const debouncedExpensive = useDebounceCallback(expensive, 1000);
```

### 2. Handle Dependencies Correctly
```tsx
// Good - stable callback reference
const debouncedHandler = useDebounceCallback(handler, 300);

useEffect(() => {
  window.addEventListener('resize', debouncedHandler);
  return () => window.removeEventListener('resize', debouncedHandler);
}, [debouncedHandler]); // debouncedHandler is stable

// Avoid - unstable reference
useEffect(() => {
  const handler = debounce(handler, 300);
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []); // handler changes on every render
```

### 3. Combine with Other Hooks
```tsx
import { useDebounceCallback } from 'usely';
import { useLocalStorage } from 'usely';

function PersistentSearch() {
  const [searchTerm, setSearchTerm] = useLocalStorage('search', '');
  
  const debouncedSearch = useDebounceCallback((query) => {
    performSearch(query);
  }, 300);

  const handleSearch = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <input
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 4. Handle Errors Gracefully
```tsx
const debouncedApiCall = useDebounceCallback(async (params) => {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    // Handle error appropriately
  }
}, 500);
```

## Common Use Cases

### Search and Filter
```tsx
function SearchAndFilter() {
  const debouncedSearch = useDebounceCallback((query) => {
    performSearch(query);
  }, 300);

  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Form Validation
```tsx
function ValidatedForm() {
  const debouncedValidate = useDebounceCallback(async (field, value) => {
    const isValid = await validateField(field, value);
    setFieldError(field, isValid ? null : 'Invalid input');
  }, 500);

  return (
    <input
      onChange={(e) => debouncedValidate('email', e.target.value)}
      placeholder="Email"
    />
  );
}
```

### Event Handlers
```tsx
function EventHandlers() {
  const debouncedScroll = useDebounceCallback(() => {
    // Handle scroll event
  }, 100);

  const debouncedResize = useDebounceCallback(() => {
    // Handle resize event
  }, 250);

  useEffect(() => {
    window.addEventListener('scroll', debouncedScroll);
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [debouncedScroll, debouncedResize]);

  return <div>Content</div>;
}
```

## Limitations

- **No Immediate Option**: No option to trigger immediately on first call
- **No Cancel Method**: No way to cancel pending debounced calls
- **Memory Usage**: Keeps timer references in memory
- **Single Function**: Each hook instance handles one callback function

## Related Hooks

- [useDebounceValue](./useDebounceValue.md) - Debounce values instead of callbacks
- [useAsync](./useAsync.md) - Handle async operations with debounced callbacks
- [useLocalStorage](./useLocalStorage.md) - Persist data with debounced updates 