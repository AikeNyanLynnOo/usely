# useNetworkStatus

A React hook to track the user's online/offline status and network connection info.

## API

```ts
const status = useNetworkStatus();
```
- `status.online`: boolean — Is the user online?
- `status.since`: Date | null — When the status last changed
- `status.effectiveType`: string (optional) — e.g., '4g', '3g' (if supported)
- `status.downlink`: number (optional) — Mbps (if supported)
- `status.rtt`: number (optional) — ms (if supported)
- `status.saveData`: boolean (optional) — (if supported)

## Example

```tsx
import useNetworkStatus from 'usely';

function Example() {
  const status = useNetworkStatus();

  return (
    <div>
      <p>Online: {status.online ? 'Yes' : 'No'}</p>
      <p>Last changed: {status.since ? status.since.toLocaleString() : 'N/A'}</p>
      {status.effectiveType && <p>Connection: {status.effectiveType}</p>}
      {status.downlink && <p>Downlink: {status.downlink} Mbps</p>}
      {status.rtt && <p>RTT: {status.rtt} ms</p>}
      {status.saveData !== undefined && <p>Save Data: {status.saveData ? 'Yes' : 'No'}</p>}
    </div>
  );
}
``` 