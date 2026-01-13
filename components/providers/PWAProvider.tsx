'use client';

import { useEffect, useState } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { X, RefreshCw, WifiOff } from 'lucide-react';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { isOffline, needsUpdate, updateServiceWorker } = useServiceWorker();
  const [showOffline, setShowOffline] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setShowOffline(true);
    } else {
      // Auto-hide offline banner after going online
      const timer = setTimeout(() => setShowOffline(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  useEffect(() => {
    if (needsUpdate) {
      setShowUpdate(true);
    }
  }, [needsUpdate]);

  const handleUpdate = () => {
    updateServiceWorker();
    setShowUpdate(false);
  };

  return (
    <>
      {children}

      {/* Offline Banner */}
      {showOffline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            isOffline
              ? 'bg-amber-500 text-white'
              : 'bg-green-500 text-white'
          }`}>
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">
              {isOffline
                ? 'You are offline. Some features may be limited.'
                : 'Back online!'}
            </p>
            <button
              onClick={() => setShowOffline(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Update Available Banner */}
      {showUpdate && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-blue-600 text-white">
            <RefreshCw className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">
              A new version is available!
            </p>
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
            >
              Update
            </button>
            <button
              onClick={() => setShowUpdate(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
