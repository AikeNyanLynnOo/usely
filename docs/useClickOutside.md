# useClickOutside

A hook that detects clicks outside of a specified element. Useful for closing modals, dropdowns, or any UI that should close when clicking outside.

## Installation

```bash
npm install useful-hooks
```

## Usage

```tsx
import { useClickOutside } from 'useful-hooks';
import { useRef } from 'react';

const ref = useRef();
useClickOutside(ref, handler);
```

## API

### Parameters

- **ref** (`RefObject<T | null>`): Ref object pointing to the element to monitor
- **handler** (`(event: MouseEvent | TouchEvent) => void`): Function to call when a click outside is detected
- **enabled** (`boolean`, optional): Whether the listener should be active (default: `true`)

### Returns

- `void`: This hook doesn't return anything

## Examples

### Basic Modal

```tsx
import { useClickOutside } from 'useful-hooks';
import { useRef, useState } from 'react';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  useClickOutside(modalRef, () => setIsOpen(false));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal">
        <h2>Modal Content</h2>
        <p>Click outside to close</p>
      </div>
    </div>
  );
}
```

### Dropdown Menu

```tsx
import { useClickOutside } from 'useful-hooks';
import { useRef, useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef} className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)}>
        Options ▼
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button>Option 1</button>
          <button>Option 2</button>
          <button>Option 3</button>
        </div>
      )}
    </div>
  );
}
```

### Conditional Listening

```tsx
import { useClickOutside } from 'useful-hooks';
import { useRef, useState } from 'react';

function ConditionalExample() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useClickOutside(ref, () => setIsOpen(false), isEnabled);

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
        Enable click outside detection
      </label>
      
      <div ref={ref} className="content">
        {isOpen ? 'Open' : 'Closed'}
        <button onClick={() => setIsOpen(!isOpen)}>
          Toggle
        </button>
      </div>
    </div>
  );
}
```

### Touch Support

The hook automatically handles both mouse and touch events, making it mobile-friendly:

```tsx
import { useClickOutside } from 'useful-hooks';
import { useRef, useState } from 'react';

function MobileFriendlyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  useClickOutside(modalRef, () => setIsOpen(false));

  return (
    <div className="mobile-modal">
      <div ref={modalRef} className="modal-content">
        <h2>Mobile Friendly</h2>
        <p>Works with both mouse clicks and touch events</p>
      </div>
    </div>
  );
}
```

## Features

### Automatic Cleanup
Event listeners are automatically cleaned up when the component unmounts or when the hook is disabled.

### Touch Support
Handles both mouse (`mousedown`) and touch (`touchstart`) events for mobile compatibility.

### Performance Optimized
Uses event delegation and only adds listeners when enabled.

### TypeScript Support
Fully typed with TypeScript generics for type safety.

## Best Practices

### 1. Use with useRef
```tsx
// Good
const ref = useRef();
useClickOutside(ref, handler);

// Avoid
const ref = { current: null };
useClickOutside(ref, handler);
```

### 2. Handle State Updates Safely
```tsx
const [isOpen, setIsOpen] = useState(false);
const ref = useRef();

useClickOutside(ref, () => {
  // Always use functional updates for state that might be stale
  setIsOpen(false);
});
```

### 3. Consider Accessibility
```tsx
const [isOpen, setIsOpen] = useState(false);
const ref = useRef();

useClickOutside(ref, () => setIsOpen(false));

return (
  <div ref={ref}>
    <button 
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      Menu
    </button>
    {isOpen && (
      <div role="menu">
        {/* Menu items */}
      </div>
    )}
  </div>
);
```

### 4. Handle Edge Cases
```tsx
const [isOpen, setIsOpen] = useState(false);
const ref = useRef();

useClickOutside(ref, (event) => {
  // Prevent closing if clicking on a specific element
  if (event.target.closest('.prevent-close')) {
    return;
  }
  setIsOpen(false);
});
```

## Common Use Cases

### Modals and Dialogs
```tsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef();
  
  useClickOutside(modalRef, onClose);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal">
        {children}
      </div>
    </div>
  );
}
```

### Tooltips
```tsx
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef();
  
  useClickOutside(tooltipRef, () => setIsVisible(false));
  
  return (
    <div ref={tooltipRef} className="tooltip-container">
      <div onMouseEnter={() => setIsVisible(true)}>
        {children}
      </div>
      {isVisible && (
        <div className="tooltip">
          {content}
        </div>
      )}
    </div>
  );
}
```

### Search Suggestions
```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef();
  
  useClickOutside(containerRef, () => setShowSuggestions(false));
  
  return (
    <div ref={containerRef} className="search-container">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <div className="suggestions">
          {/* Suggestions */}
        </div>
      )}
    </div>
  );
}
```

## Limitations

- **Event Timing**: Uses `mousedown` and `touchstart` events (not `click`)
- **Bubbling**: Relies on event bubbling to detect outside clicks
- **Nested Elements**: Won't trigger for clicks on child elements
- **Dynamic Content**: May need to re-attach if DOM structure changes significantly

## Related Hooks

- [useEventListenerRef](./useEventListenerRef.md) - More general event listener hook
- [useLocalStorage](./useLocalStorage.md) - Persist UI state 