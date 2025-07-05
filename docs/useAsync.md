# useAsync

A hook that handles async operations with automatic loading, error, and success states. Provides a clean API for data fetching and other async operations with built-in cancellation support.

## Installation

```bash
npm install useful-hooks
```

## Usage

```tsx
import { useAsync } from 'useful-hooks';

const [execute, { data, loading, error, reset }] = useAsync(asyncFunction);
```

## API

### Parameters

- **asyncFunction** (`(...args: any[]) => Promise<T>`): The async function to execute
- **options** (`AsyncOptions`, optional): Configuration options
  - **immediate** (`boolean`): Execute immediately on mount (default: `false`)
  - **onSuccess** (`(data: T) => void`): Callback called on successful execution
  - **onError** (`(error: Error) => void`): Callback called on error

### Returns

- **execute** (`(...args: any[]) => Promise<T | undefined>`): Function to execute the async operation
- **state** (`AsyncState<T> & { reset: () => void }`): Current state object
  - **data** (`T | null`): Result of the async operation
  - **loading** (`boolean`): Whether the operation is currently running
  - **error** (`Error | null`): Error from the async operation
  - **reset** (`() => void`): Function to reset the state

## Examples

### Basic Data Fetching

```tsx
import { useAsync } from 'useful-hooks';

function UserProfile({ userId }) {
  const [fetchUser, { data: user, loading, error }] = useAsync(
    async (id) => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  );

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Immediate Execution

```tsx
import { useAsync } from 'useful-hooks';

function AutoFetchingComponent() {
  const [fetchData, { data, loading, error }] = useAsync(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    { immediate: true } // Executes immediately on mount
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

### With Success/Error Callbacks

```tsx
import { useAsync } from 'useful-hooks';

function FormSubmission() {
  const [submitForm, { loading, error }] = useAsync(
    async (formData) => {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      return response.json();
    },
    {
      onSuccess: (data) => {
        console.log('Form submitted successfully:', data);
        // Show success notification
      },
      onError: (error) => {
        console.error('Form submission failed:', error);
        // Show error notification
      }
    }
  );

  const handleSubmit = async (formData) => {
    await submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

### Manual Reset

```tsx
import { useAsync } from 'useful-hooks';

function ResettableComponent() {
  const [fetchData, { data, loading, error, reset }] = useAsync(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    }
  );

  return (
    <div>
      <button onClick={() => fetchData()}>Fetch Data</button>
      <button onClick={reset}>Reset</button>
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```

### Cancellation Support

```tsx
import { useAsync } from 'useful-hooks';

function SearchComponent() {
  const [search, { data, loading, error }] = useAsync(
    async (query) => {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch(`/api/search?q=${query}`);
      return response.json();
    }
  );

  const handleSearch = (query) => {
    // Previous request will be cancelled automatically
    search(query);
  };

  return (
    <div>
      <input 
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```

## Advanced Examples

### Multiple Async Operations

```tsx
import { useAsync } from 'useful-hooks';

function Dashboard() {
  const [fetchUsers, { data: users, loading: usersLoading }] = useAsync(
    async () => {
      const response = await fetch('/api/users');
      return response.json();
    }
  );

  const [fetchPosts, { data: posts, loading: postsLoading }] = useAsync(
    async () => {
      const response = await fetch('/api/posts');
      return response.json();
    }
  );

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const isLoading = usersLoading || postsLoading;

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2>Users ({users?.length || 0})</h2>
      {/* Render users */}
      
      <h2>Posts ({posts?.length || 0})</h2>
      {/* Render posts */}
    </div>
  );
}
```

### Conditional Execution

```tsx
import { useAsync } from 'useful-hooks';

function ConditionalFetch({ userId, shouldFetch }) {
  const [fetchUser, { data, loading, error }] = useAsync(
    async (id) => {
      const response = await fetch(`/api/users/${id}`);
      return response.json();
    }
  );

  useEffect(() => {
    if (shouldFetch && userId) {
      fetchUser(userId);
    }
  }, [shouldFetch, userId]);

  if (!shouldFetch) return <div>Fetching disabled</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.name}</div>;
}
```

### Error Handling with Retry

```tsx
import { useAsync } from 'useful-hooks';

function RetryExample() {
  const [fetchWithRetry, { data, loading, error }] = useAsync(
    async (retryCount = 0) => {
      try {
        const response = await fetch('/api/unreliable-endpoint');
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      } catch (err) {
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchWithRetry(retryCount + 1);
        }
        throw err;
      }
    }
  );

  return (
    <div>
      <button onClick={() => fetchWithRetry()}>Fetch with Retry</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```

## Features

### Automatic Cancellation
Previous requests are automatically cancelled when a new request is made, preventing race conditions.

### SSR Safe
Works safely in server-side rendering environments.

### Memory Leak Prevention
Automatically prevents state updates if the component unmounts during an async operation.

### Error Handling
Converts non-Error objects to Error instances for consistent error handling.

### TypeScript Support
Fully typed with TypeScript generics for type safety.

## Best Practices

### 1. Handle Loading States
```tsx
const [fetchData, { data, loading, error }] = useAsync(fetchFunction);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <DataDisplay data={data} />;
```

### 2. Use Functional Updates for Dependencies
```tsx
const [fetchData, { data }] = useAsync(
  async (id) => {
    const response = await fetch(`/api/data/${id}`);
    return response.json();
  }
);

// Good - stable reference
useEffect(() => {
  fetchData(userId);
}, [userId]); // fetchData is stable

// Avoid - unstable reference
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]); // fetchData changes on every render
```

### 3. Handle Errors Gracefully
```tsx
const [submitForm, { loading, error }] = useAsync(
  async (formData) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Submission failed');
    }
    
    return response.json();
  }
);
```

### 4. Use Immediate Execution Sparingly
```tsx
// Good for simple data fetching
const [fetchData, { data }] = useAsync(fetchFunction, { immediate: true });

// Better for complex scenarios
const [fetchData, { data }] = useAsync(fetchFunction);

useEffect(() => {
  if (shouldFetch) {
    fetchData();
  }
}, [shouldFetch]);
```

## Common Patterns

### Data Fetching Pattern
```tsx
function DataComponent({ id }) {
  const [fetchData, { data, loading, error }] = useAsync(
    async (id) => {
      const response = await fetch(`/api/data/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  );

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
}
```

### Form Submission Pattern
```tsx
function FormComponent() {
  const [submitForm, { loading, error, reset }] = useAsync(
    async (formData) => {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      return response.json();
    }
  );

  const handleSubmit = async (formData) => {
    try {
      const result = await submitForm(formData);
      // Handle success
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

## Limitations

- **Single Function**: Each hook instance handles one async function
- **No Built-in Retry**: Retry logic must be implemented manually
- **No Caching**: No built-in caching mechanism
- **No Request Deduplication**: Multiple calls to the same function will execute separately

## Related Hooks

- [useLocalStorage](./useLocalStorage.md) - Persist async results
- [useDebounceCallback](./useDebounceCallback.md) - Debounce async function calls 