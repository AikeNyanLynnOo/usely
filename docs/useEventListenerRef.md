# useEventListenerRef

A hook that attaches an event listener to a DOM element via ref, handling cleanup and updates automatically. Provides a clean way to add event listeners to React components without manual cleanup.

## Installation

```bash
npm install usely
```

## Usage

```tsx
import { useEventListenerRef } from 'usely';

const ref = useEventListenerRef('click', handler);
```

## API

### Parameters

- **eventName** (`keyof HTMLElementEventMap`): The event to listen for (e.g., 'click', 'scroll', 'keydown')
- **handler** (`(event: HTMLElementEventMap[typeof eventName]) => void`): The event handler function
- **options** (`boolean | AddEventListenerOptions`, optional): Event listener options

### Returns

- **ref** (`RefCallback<T>`): A ref callback to attach to the target element

## Examples

### Basic Click Handler

```tsx
import { useEventListenerRef } from 'usely';
import { useState } from 'react';

function ClickCounter() {
  const [count, setCount] = useState(0);
  
  const buttonRef = useEventListenerRef('click', () => {
    setCount(prev => prev + 1);
  });

  return (
    <div>
      <button ref={buttonRef}>Click me!</button>
      <p>Clicked {count} times</p>
    </div>
  );
}
```

### Keyboard Event Handler

```tsx
import { useEventListenerRef } from 'usely';
import { useState } from 'react';

function KeyboardHandler() {
  const [lastKey, setLastKey] = useState('');
  
  const inputRef = useEventListenerRef('keydown', (event) => {
    setLastKey(event.key);
    console.log('Key pressed:', event.key);
  });

  return (
    <div>
      <input 
        ref={inputRef}
        placeholder="Type something..."
      />
      <p>Last key pressed: {lastKey}</p>
    </div>
  );
}
```

### Scroll Event Handler

```tsx
import { useEventListenerRef } from 'usely';
import { useState, useEffect } from 'react';

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  
  const containerRef = useEventListenerRef('scroll', (event) => {
    setScrollY(event.target.scrollTop);
  });

  return (
    <div 
      ref={containerRef}
      style={{ 
        height: '200px', 
        overflow: 'auto',
        border: '1px solid #ccc'
      }}
    >
      <div style={{ height: '1000px', padding: '20px' }}>
        <p>Scroll position: {scrollY}px</p>
        <p>Scroll down to see the position change...</p>
        {/* More content */}
      </div>
    </div>
  );
}
```

### Form Input Handler

```tsx
import { useEventListenerRef } from 'usely';
import { useState } from 'react';

function FormInput() {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const inputRef = useEventListenerRef('input', (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    // Validate on input
    setIsValid(newValue.length >= 3);
  });

  return (
    <div>
      <input 
        ref={inputRef}
        placeholder="Enter at least 3 characters..."
        className={isValid ? 'valid' : 'invalid'}
      />
      {!isValid && <span>Please enter at least 3 characters</span>}
      <p>Current value: {value}</p>
    </div>
  );
}
```

### Mouse Event Handler

```tsx
import { useEventListenerRef } from 'usely';
import { useState } from 'react';

function MouseTracker() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useEventListenerRef('mousemove', (event) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  });

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '300px', 
        height: '200px', 
        border: '1px solid #ccc',
        position: 'relative'
      }}
    >
      <p>Mouse position: {mousePosition.x}, {mousePosition.y}</p>
      <div 
        style={{
          position: 'absolute',
          left: mousePosition.x - 5,
          top: mousePosition.y - 5,
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
```

## Advanced Examples

### Multiple Event Handlers

```tsx
import { useEventListenerRef } from 'usely';
import { useState } from 'react';

function MultiEventHandler() {
  const [events, setEvents] = useState([]);
  
  const clickRef = useEventListenerRef('click', () => {
    setEvents(prev => [...prev, 'click']);
  });
  
  const mouseEnterRef = useEventListenerRef('mouseenter', () => {
    setEvents(prev => [...prev, 'mouseenter']);
  });
  
  const mouseLeaveRef = useEventListenerRef('mouseleave', () => {
    setEvents(prev => [...prev, 'mouseleave']);
  });

  return (
    <div>
      <button 
        ref={(el) => {
          clickRef(el);
          mouseEnterRef(el);
          mouseLeaveRef(el);
        }}
      >
        Hover and click me!
      </button>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Conditional Event Handling

```tsx
import { useEventListenerRef } from 'usely';
import { useState, useCallback } from 'react';

function ConditionalHandler() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback((event) => {
    if (isEnabled) {
      setCount(prev => prev + 1);
    }
  }, [isEnabled]);
  
  const buttonRef = useEventListenerRef('click', handleClick);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
        Enable click handler
      </label>
      <button ref={buttonRef}>
        Click me ({count})
      </button>
    </div>
  );
}
```

### Custom Event Options

```tsx
import { useEventListenerRef } from 'usely';
import { useState } from 'react';

function CustomOptions() {
  const [keyCount, setKeyCount] = useState(0);
  
  const inputRef = useEventListenerRef('keydown', (event) => {
    setKeyCount(prev => prev + 1);
    console.log('Key pressed:', event.key);
  }, {
    capture: true, // Use capture phase
    passive: false  // Allow preventDefault
  });

  return (
    <div>
      <input 
        ref={inputRef}
        placeholder="Type with capture phase..."
      />
      <p>Keys pressed: {keyCount}</p>
    </div>
  );
}
```

### Dynamic Event Handling

```tsx
import { useEventListenerRef } from 'usely';
import { useState, useEffect } from 'react';

function DynamicHandler() {
  const [eventType, setEventType] = useState('click');
  const [count, setCount] = useState(0);
  
  const buttonRef = useEventListenerRef(eventType, () => {
    setCount(prev => prev + 1);
  });

  return (
    <div>
      <select 
        value={eventType} 
        onChange={(e) => setEventType(e.target.value)}
      >
        <option value="click">Click</option>
        <option value="mouseenter">Mouse Enter</option>
        <option value="mouseleave">Mouse Leave</option>
        <option value="focus">Focus</option>
        <option value="blur">Blur</option>
      </select>
      
      <button ref={buttonRef}>
        Trigger {eventType} ({count})
      </button>
    </div>
  );
}
```

### Form Validation with Multiple Events

```tsx
import { useEventListenerRef } from 'usely';
import { useState } from 'react';

function ValidatedForm() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);
  
  const emailRef = useEventListenerRef('input', (event) => {
    const value = event.target.value;
    setEmail(value);
    setIsValid(value.includes('@'));
  });
  
  const focusRef = useEventListenerRef('focus', () => {
    setTouched(true);
  });
  
  const blurRef = useEventListenerRef('blur', () => {
    setTouched(true);
  });

  return (
    <div>
      <input 
        ref={(el) => {
          emailRef(el);
          focusRef(el);
          blurRef(el);
        }}
        type="email"
        value={email}
        placeholder="Enter email..."
        className={touched && !isValid ? 'invalid' : ''}
      />
      {touched && !isValid && (
        <span className="error">Please enter a valid email</span>
      )}
    </div>
  );
}
```

## Features

### Automatic Cleanup
Event listeners are automatically removed when the component unmounts or when the event name, handler, or options change.

### Handler Updates
The hook automatically updates the event listener when the handler function changes, ensuring the latest handler is always used.

### TypeScript Support
Fully typed with TypeScript for type safety and IntelliSense support.

### Performance Optimized
Uses `useRef` and `useEffect` efficiently to prevent unnecessary re-renders.

### SSR Safe
Works safely in server-side rendering environments.

## Best Practices

### 1. Use Stable Handler References
```tsx
// Good - stable handler reference
const handleClick = useCallback(() => {
  console.log('Button clicked');
}, []);

const buttonRef = useEventListenerRef('click', handleClick);

// Avoid - unstable handler reference
const buttonRef = useEventListenerRef('click', () => {
  console.log('Button clicked');
});
```

### 2. Handle Multiple Events Efficiently
```tsx
// Good - separate refs for different events
const clickRef = useEventListenerRef('click', handleClick);
const hoverRef = useEventListenerRef('mouseenter', handleHover);

// Apply to same element
<button ref={(el) => {
  clickRef(el);
  hoverRef(el);
}}>

// Avoid - single ref with multiple handlers
const ref = useEventListenerRef('click', handleClick);
// This won't work for multiple events
```

### 3. Use Appropriate Event Types
```tsx
// For user interactions
const clickRef = useEventListenerRef('click', handleClick);
const inputRef = useEventListenerRef('input', handleInput);

// For keyboard events
const keyRef = useEventListenerRef('keydown', handleKeyDown);

// For mouse events
const mouseRef = useEventListenerRef('mousemove', handleMouseMove);

// For form events
const formRef = useEventListenerRef('submit', handleSubmit);
```

### 4. Combine with Other Hooks
```tsx
import { useEventListenerRef } from 'usely';
import { useLocalStorage } from 'usely';

function PersistentForm() {
  const [value, setValue] = useLocalStorage('form-value', '');
  
  const inputRef = useEventListenerRef('input', (event) => {
    setValue(event.target.value);
  });

  return (
    <input 
      ref={inputRef}
      value={value}
      placeholder="This value persists..."
    />
  );
}
```

## Common Use Cases

### Interactive Components
```tsx
function InteractiveButton() {
  const [isPressed, setIsPressed] = useState(false);
  
  const buttonRef = useEventListenerRef('mousedown', () => setIsPressed(true));
  const upRef = useEventListenerRef('mouseup', () => setIsPressed(false));
  const leaveRef = useEventListenerRef('mouseleave', () => setIsPressed(false));

  return (
    <button 
      ref={(el) => {
        buttonRef(el);
        upRef(el);
        leaveRef(el);
      }}
      className={isPressed ? 'pressed' : ''}
    >
      Press me!
    </button>
  );
}
```

### Form Validation
```tsx
function ValidatedInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  const inputRef = useEventListenerRef('input', (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    if (newValue.length < 3) {
      setError('Too short');
    } else {
      setError('');
    }
  });

  return (
    <div>
      <input ref={inputRef} placeholder="Enter text..." />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

### Keyboard Shortcuts
```tsx
function KeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState([]);
  
  const documentRef = useEventListenerRef('keydown', (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      setShortcuts(prev => [...prev, 'Ctrl+S']);
    }
  });

  useEffect(() => {
    // Attach to document
    documentRef(document);
  }, []);

  return (
    <div>
      <p>Press Ctrl+S to save</p>
      <ul>
        {shortcuts.map((shortcut, index) => (
          <li key={index}>{shortcut}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Limitations

- **Single Element**: Each hook instance handles one element
- **Event Type**: Each hook instance handles one event type
- **Ref Pattern**: Requires using the ref callback pattern
- **No Event Delegation**: No built-in event delegation support

## Related Hooks

- [useClickOutside](./useClickOutside.md) - Detect clicks outside an element
- [useLocalStorage](./useLocalStorage.md) - Persist form data
- [useDebounceCallback](./useDebounceCallback.md) - Debounce event handlers 