'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import {
  AssistantChatTransport,
  useChatRuntime,
} from '@assistant-ui/react-ai-sdk';
import type { UIMessage } from 'ai';
import { BotIcon, GripIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Thread,
  type ThreadDragHandleProps,
} from '@/components/assistant-ui/thread';
import { getDeviceId } from '@/lib/device-id';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────
const BTN_SIZE = 44;
const DEFAULT_SIZE = { w: 370, h: 500 };
const MIN_SIZE = { w: 280, h: 350 };
const MAX_SIZE = { w: 560, h: 720 };

function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function getDefaultBtnPos() {
  return {
    x: window.innerWidth - BTN_SIZE - 16,
    y: window.innerHeight - BTN_SIZE - 16,
  };
}

// ── Storage ───────────────────────────────────────────────────────────────────
function chatKey(deviceId: string) {
  return `ask-moaaz:${deviceId}`;
}

interface PersistedChat {
  sessionId: string;
  messages: UIMessage[];
}

function loadPersistedChat(deviceId: string): PersistedChat | null {
  try {
    const raw = localStorage.getItem(chatKey(deviceId));
    return raw ? (JSON.parse(raw) as PersistedChat) : null;
  } catch {
    return null;
  }
}

function savePersistedChat(deviceId: string, data: PersistedChat) {
  try {
    localStorage.setItem(chatKey(deviceId), JSON.stringify(data));
  } catch {
    // Quota exceeded or private mode
  }
}

// ── Public state ──────────────────────────────────────────────────────────────
interface AssistantPublicState {
  enabled: boolean;
  name: string;
  greeting: string;
  suggestedPrompts: string[];
}

// ── Root (enabled check) ──────────────────────────────────────────────────────
export function AskMoaazWidget() {
  const [state, setState] = useState<AssistantPublicState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/assistant/config')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: AssistantPublicState) => setState(data))
      .catch(() => setError(true));
  }, []);

  if (error || !state || !state.enabled) return null;
  return <AskMoaazInner state={state} />;
}

// ── Inner widget ──────────────────────────────────────────────────────────────
function AskMoaazInner({ state }: { state: AssistantPublicState }) {
  // ── open/close ──────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);

  // ── button drag ─────────────────────────────────────────────────────────────
  const [btnPos, setBtnPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 16, y: 16 };
    try {
      const raw = localStorage.getItem('ask-moaaz-btn-pos');
      if (raw) return JSON.parse(raw) as { x: number; y: number };
    } catch {
      // ignore
    }
    return getDefaultBtnPos();
  });

  const isDraggingBtn = useRef(false);
  const didDragBtn = useRef(false);
  const btnDragStart = useRef({ px: 0, py: 0, bx: 0, by: 0 });

  // ── window drag (via Thread header) ─────────────────────────────────────────
  const [winPos, setWinPos] = useState({ left: 0, top: 0 });
  const isDraggingWin = useRef(false);
  const winDragStart = useRef({ px: 0, py: 0, wx: 0, wy: 0 });

  // ── resize ──────────────────────────────────────────────────────────────────
  const [size, setSize] = useState(DEFAULT_SIZE);
  const isResizing = useRef(false);
  const resizeStart = useRef({ px: 0, py: 0, w: 0, h: 0 });

  // ── persistence ─────────────────────────────────────────────────────────────
  const deviceIdRef = useRef<string>('');
  const sessionIdRef = useRef<string | undefined>(undefined);

  const [initialMessages] = useState<UIMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    const deviceId = getDeviceId();
    deviceIdRef.current = deviceId;
    const persisted = loadPersistedChat(deviceId);
    if (persisted) {
      sessionIdRef.current = persisted.sessionId;
      return persisted.messages;
    }
    return [];
  });

  const customFetch: typeof fetch = useCallback(async (input, init) => {
    const originalBody = init?.body ? JSON.parse(init.body as string) : {};
    const patchedInit: RequestInit = {
      ...(init ?? {}),
      body: JSON.stringify({
        ...originalBody,
        deviceId: deviceIdRef.current,
        sessionId: sessionIdRef.current,
        pagePath: window.location.pathname,
        referrer: document.referrer || undefined,
      }),
    };
    const response = await fetch(input, patchedInit);
    const newSessionId = response.headers.get('x-chat-session-id');
    if (newSessionId) sessionIdRef.current = newSessionId;
    return response;
  }, []);

  const runtime = useChatRuntime({
    messages: initialMessages,
    transport: new AssistantChatTransport({
      api: '/api/chat',
      fetch: customFetch,
    }),
  });

  // Persist messages to localStorage on change
  useEffect(() => {
    const thread = runtime.thread;
    return thread.subscribe(() => {
      const msgs = thread.getState().messages;
      if (!msgs.length || !sessionIdRef.current || !deviceIdRef.current) return;
      const uiMessages: UIMessage[] = msgs
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          parts: m.content
            .filter(
              (p): p is { type: 'text'; text: string } => p.type === 'text',
            )
            .map((p) => ({ type: 'text' as const, text: p.text })),
        }));
      if (uiMessages.length) {
        savePersistedChat(deviceIdRef.current, {
          sessionId: sessionIdRef.current,
          messages: uiMessages,
        });
      }
    });
  }, [runtime]);

  // Navbar "Ask Moaaz" button
  useEffect(() => {
    const handler = () => {
      if (!open) openWidget();
    };
    window.addEventListener('ask-moaaz-open', handler);
    return () => window.removeEventListener('ask-moaaz-open', handler);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // ── Open helper ─────────────────────────────────────────────────────────────
  function openWidget() {
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    // Position chat window to the left of / above the button
    let left = btnPos.x - size.w - 8;
    if (left < 8) left = Math.min(btnPos.x + BTN_SIZE + 8, iw - size.w - 8);
    const top = clamp(8, btnPos.y + BTN_SIZE - size.h, ih - size.h - 8);
    setWinPos({ left: clamp(8, left, iw - size.w - 8), top });
    setOpen(true);
  }

  // ── Button drag handlers ─────────────────────────────────────────────────────
  function handleBtnPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingBtn.current = true;
    didDragBtn.current = false;
    btnDragStart.current = {
      px: e.clientX,
      py: e.clientY,
      bx: btnPos.x,
      by: btnPos.y,
    };
  }

  function handleBtnPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!isDraggingBtn.current) return;
    const dx = e.clientX - btnDragStart.current.px;
    const dy = e.clientY - btnDragStart.current.py;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDragBtn.current = true;
    const newPos = {
      x: clamp(0, btnDragStart.current.bx + dx, window.innerWidth - BTN_SIZE),
      y: clamp(0, btnDragStart.current.by + dy, window.innerHeight - BTN_SIZE),
    };
    setBtnPos(newPos);
    try {
      localStorage.setItem('ask-moaaz-btn-pos', JSON.stringify(newPos));
    } catch {
      /* ignore */
    }
  }

  function handleBtnPointerUp() {
    isDraggingBtn.current = false;
    if (!didDragBtn.current) {
      if (!open) openWidget();
      else setOpen(false);
    }
  }

  // ── Window drag handlers (passed to Thread header as dragHandle) ─────────────
  const dragHandle: ThreadDragHandleProps = {
    onPointerDown(e) {
      if ((e.target as HTMLElement).closest('button')) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      isDraggingWin.current = true;
      winDragStart.current = {
        px: e.clientX,
        py: e.clientY,
        wx: winPos.left,
        wy: winPos.top,
      };
    },
    onPointerMove(e) {
      if (!isDraggingWin.current) return;
      const iw = window.innerWidth,
        ih = window.innerHeight;
      setWinPos({
        left: clamp(
          0,
          winDragStart.current.wx + (e.clientX - winDragStart.current.px),
          iw - size.w,
        ),
        top: clamp(
          0,
          winDragStart.current.wy + (e.clientY - winDragStart.current.py),
          ih - size.h,
        ),
      });
    },
    onPointerUp() {
      isDraggingWin.current = false;
    },
  };

  // ── Resize handle handlers ───────────────────────────────────────────────────
  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    isResizing.current = true;
    resizeStart.current = {
      px: e.clientX,
      py: e.clientY,
      w: size.w,
      h: size.h,
    };
  }

  function handleResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isResizing.current) return;
    setSize({
      w: clamp(
        MIN_SIZE.w,
        resizeStart.current.w + (e.clientX - resizeStart.current.px),
        MAX_SIZE.w,
      ),
      h: clamp(
        MIN_SIZE.h,
        resizeStart.current.h + (e.clientY - resizeStart.current.py),
        MAX_SIZE.h,
      ),
    });
  }

  function handleResizePointerUp() {
    isResizing.current = false;
  }

  // ── Clear chat ───────────────────────────────────────────────────────────────
  function handleClear() {
    if (deviceIdRef.current) {
      try {
        localStorage.removeItem(chatKey(deviceIdRef.current));
      } catch {
        /* ignore */
      }
    }
    sessionIdRef.current = undefined;
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* ── Floating launcher button ─────────────────────────────────────── */}
      <button
        style={{
          position: 'fixed',
          left: btnPos.x,
          top: btnPos.y,
          width: BTN_SIZE,
          height: BTN_SIZE,
          zIndex: 51,
          touchAction: 'none',
        }}
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'bg-primary text-primary-foreground shadow-lg',
          'cursor-grab select-none active:cursor-grabbing',
          'transition-shadow hover:shadow-xl',
        )}
        onPointerDown={handleBtnPointerDown}
        onPointerMove={handleBtnPointerMove}
        onPointerUp={handleBtnPointerUp}
        aria-label={open ? 'Close chat' : 'Ask Moaaz'}
      >
        {/* Pulse ring when closed */}
        {!open && (
          <span className="bg-primary absolute inset-0 animate-ping rounded-full opacity-35" />
        )}
        {/* Hover ring when open */}
        {open && (
          <span className="border-primary/60 absolute -inset-0.75 rounded-full border-2" />
        )}
        <BotIcon
          className={cn(
            'absolute size-5 transition-all duration-200',
            open
              ? 'scale-0 rotate-90 opacity-0'
              : 'scale-100 rotate-0 opacity-100',
          )}
        />
        <XIcon
          className={cn(
            'absolute size-5 transition-all duration-200',
            open
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 -rotate-90 opacity-0',
          )}
        />
      </button>

      {/* ── Chat window ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          left: winPos.left,
          top: winPos.top,
          width: size.w,
          height: size.h,
          zIndex: 50,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transform: open ? 'scale(1)' : 'scale(0.95)',
          transformOrigin: 'bottom right',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
        className="aui-root bg-popover text-popover-foreground flex flex-col overflow-hidden rounded-xl border shadow-xl"
      >
        <Thread
          welcome={{
            name: state.name,
            greeting: state.greeting,
            prompts: state.suggestedPrompts,
          }}
          onClear={handleClear}
          dragHandle={dragHandle}
        />

        {/* Resize handle — bottom-right corner */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 20,
            height: 20,
            zIndex: 10,
            cursor: 'se-resize',
            touchAction: 'none',
          }}
          className="flex items-center justify-center opacity-25 transition-opacity hover:opacity-60"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        >
          <GripIcon className="size-3 rotate-45" />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}
