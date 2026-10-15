import React from 'react';
import { WifiOff } from 'lucide-react';
import { useBrowser } from '../../context/BrowserContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useBrowser();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs shadow-lg backdrop-blur-md animate-slide-up"
    >
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <span>Offline mode active — utilizing cached research and local inference only</span>
    </aside>
  );
};
