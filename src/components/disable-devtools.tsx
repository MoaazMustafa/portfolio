'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Context to share devtools state across the app
const DevToolsContext = createContext<{ isDevToolsOpen: boolean }>({
  isDevToolsOpen: false,
});

export function useDevToolsState() {
  return useContext(DevToolsContext);
}

interface DevToolsProviderProps {
  children: React.ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
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
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
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
      //Cmd+option+I
      if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault();
        return false;
      }
      // Cmd+shift+C (Mac Inspect Element)
      if (e.metaKey && e.shiftKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
    };

    //disable pinching
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
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
    document.addEventListener('touchmove', handleTouchMove);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <DevToolsContext.Provider value={{ isDevToolsOpen }}>
      {isDevToolsOpen ? <AccessRestrictedScreen /> : children}
    </DevToolsContext.Provider>
  );
}

function AccessRestrictedScreen() {
  return (
    <div className="bg-background fixed inset-0 z-9999 flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/50 via-black to-black" />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(239,68,68,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/5 h-1 w-1 animate-ping rounded-full bg-red-500/60"
          style={{ animationDuration: '3s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-1.5 w-1.5 animate-ping rounded-full bg-rose-400/50"
          style={{ animationDuration: '2.5s', animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 h-1 w-1 animate-ping rounded-full bg-red-400/70"
          style={{ animationDuration: '4s', animationDelay: '0.5s' }}
        />
        <div
          className="absolute top-2/3 right-1/3 h-2 w-2 animate-ping rounded-full bg-red-600/40"
          style={{ animationDuration: '3.5s', animationDelay: '2s' }}
        />
        <div
          className="absolute right-1/5 bottom-1/4 h-1 w-1 animate-ping rounded-full bg-rose-500/60"
          style={{ animationDuration: '2.8s', animationDelay: '1.5s' }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 animate-pulse rounded-full bg-red-600/20 blur-[100px]" />
      <div
        className="absolute -right-20 -bottom-20 h-80 w-80 animate-pulse rounded-full bg-rose-600/15 blur-[80px]"
        style={{ animationDelay: '1s' }}
      />

      {/* Main card */}
      <div className="relative mx-4 max-w-lg rounded-3xl border border-red-500/20 p-12 text-center shadow-[0_0_80px_-20px_rgba(239,68,68,0.4)] backdrop-blur-xl">
        {/* Animated border glow */}
        {/* <div className="absolute -inset-px animate-pulse rounded-3xl bg-gradient-to-r from-red-600/50 via-rose-500/50 to-red-600/50 opacity-50 blur-sm" /> */}
        {/* <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-red-900/90 via-black to-red-900/90" /> */}

        {/* Content */}
        <div className="relative">
          {/* Shield Icon with glow */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Rotating rings */}
              <div className="absolute -inset-6 animate-[spin_8s_linear_infinite] rounded-full border border-red-500/20" />
              <div className="absolute -inset-10 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-dashed border-red-500/10" />

              {/* Pulsing glow */}
              <div className="absolute -inset-4 animate-pulse rounded-full bg-red-500/20 blur-xl" />

              {/* Icon container */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/30 via-red-600/20 to-transparent shadow-2xl ring-2 shadow-red-500/30 ring-red-500/50">
                <svg
                  className="h-12 w-12 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <h2 className="font-nyghtserif bg-gradient-to-r from-red-400 via-rose-300 to-red-400 bg-clip-text text-4xl font-bold text-transparent drop-shadow-sm">
              Access Restricted
            </h2>
            <p className="text-muted-foreground mx-auto max-w-sm text-base leading-relaxed">
              Developer tools are not allowed on this site. Please close the
              developer console to continue browsing.
            </p>
          </div>

          {/* Decorative line */}
          <div className="my-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500/50" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50" />
          </div>

          {/* Footer */}
          <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <svg
              className="h-4 w-4 text-red-500/70"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Protected by security measures</span>
          </div>
        </div>
      </div>

      {/* Scanline effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />
    </div>
  );
}

// Legacy component for backward compatibility - now just returns null
// Use DevToolsProvider instead
export function DisableDevTools() {
  return null;
}
