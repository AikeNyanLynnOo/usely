import { useEffect, useState } from 'react';

interface NetworkStatus {
  online: boolean;
  since: Date | null;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

function getConnectionInfo() {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (!connection) return {};
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
}

export default function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => ({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    since: null,
    ...getConnectionInfo(),
  }));

  useEffect(() => {
    const updateOnline = () => setStatus(s => ({
      ...s,
      online: true,
      since: new Date(),
    }));
    const updateOffline = () => setStatus(s => ({
      ...s,
      online: false,
      since: new Date(),
    }));
    const updateConnection = () => setStatus(s => ({
      ...s,
      ...getConnectionInfo(),
    }));

    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOffline);
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection && connection.addEventListener) {
      connection.addEventListener('change', updateConnection);
    }

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOffline);
      if (connection && connection.removeEventListener) {
        connection.removeEventListener('change', updateConnection);
      }
    };
  }, []);

  return status;
} 