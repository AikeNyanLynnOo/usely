import { act, render, renderHook, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import useClickOutside from '../useClickOutside';

describe('useClickOutside', () => {
  let mockHandler: jest.Mock;

  beforeEach(() => {
    mockHandler = jest.fn();
  });

  it('should call handler when clicking outside the element', async () => {
    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return <div ref={ref}>Test</div>;
    };

    const { container } = render(<TestComponent />);

    // Wait for the component to mount and event listeners to be attached
    await waitFor(() => {
      expect(container.querySelector('div')).toBeTruthy();
    });

    // Simulate click outside
    act(() => {
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.body.removeChild(outsideElement);
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it('should call handler when clicking outside the element - simple test', () => {
    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return <div ref={ref}>Test</div>;
    };

    render(<TestComponent />);

    // Simulate click outside directly on document
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it('should not call handler when clicking inside the element', () => {
    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return <div ref={ref}>Test</div>;
    };

    const { container } = render(<TestComponent />);

    // Simulate click inside
    act(() => {
      const insideElement = container.querySelector('div');
      insideElement?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should not call handler when clicking on child elements', () => {
    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return (
        <div ref={ref}>
          <button>Child Button</button>
        </div>
      );
    };

    const { container } = render(<TestComponent />);

    // Simulate click on child element
    act(() => {
      const childButton = container.querySelector('button');
      if (childButton) {
        childButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      }
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should handle touch events', () => {
    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return <div ref={ref}>Test</div>;
    };

    const { container } = render(<TestComponent />);

    // Simulate touch outside
    act(() => {
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      document.body.removeChild(outsideElement);
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(expect.any(TouchEvent));
  });

  it('should not call handler when disabled', () => {
    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler, false); // disabled
      return <div ref={ref}>Test</div>;
    };

    const { container } = render(<TestComponent />);

    // Simulate click outside
    act(() => {
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.body.removeChild(outsideElement);
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should handle null ref gracefully', () => {
    const TestComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return <div>Test</div>; // No ref attached
    };

    const { container } = render(<TestComponent />);

    // Simulate click outside
    act(() => {
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.body.removeChild(outsideElement);
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, mockHandler);
      return ref;
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should update handler when handler changes', () => {
    const newHandler = jest.fn();
    
    const TestComponent = ({ handler }: { handler: jest.Mock }) => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);
      return <div ref={ref}>Test</div>;
    };

    const { rerender } = render(<TestComponent handler={mockHandler} />);

    // Simulate click outside with first handler
    act(() => {
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.body.removeChild(outsideElement);
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(newHandler).not.toHaveBeenCalled();

    // Update handler
    rerender(<TestComponent handler={newHandler} />);

    // Simulate click outside with new handler
    act(() => {
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.body.removeChild(outsideElement);
    });

    expect(mockHandler).toHaveBeenCalledTimes(1); // Should not be called again
    expect(newHandler).toHaveBeenCalledTimes(1);
  });
}); 