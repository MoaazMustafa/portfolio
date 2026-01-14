'use client';

import { useEffect, useState } from 'react';

export function DisableDevTools() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Only enable devtools-disabling behavior in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Detect DevTools open/close
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const isOpen = widthThreshold || heightThreshold;

      setIsDevToolsOpen(isOpen);
    };

    // Check DevTools status on interval
    const interval = setInterval(detectDevTools, 500);
    detectDevTools(); // Initial check

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+I (Mac Inspector)
      if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && e.key === 'j') {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+C (Mac Inspect)
      if (e.metaKey && e.altKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      // Cmd+shift+C (Mac Inspect Element)
      if (e.metaKey && e.shiftKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection (optional - can be removed if needed)
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  if (!isDevToolsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl">
      <div className="mx-4 max-w-md space-y-6 rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/50 to-black/80 p-8 text-center shadow-2xl shadow-red-500/20">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-2 ring-red-500/50">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-nyghtserif text-3xl font-bold text-red-500">
            Access Restricted
          </h2>
          <p className="text-base text-gray-300">
            Developer tools are not allowed on this site. Please close the
            developer console to continue browsing.
          </p>
        </div>
        <div className="pt-2 text-xs text-gray-500">
          This measure helps protect the integrity of the site
        </div>
      </div>
    </div>
  );
}
