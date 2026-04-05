'use client';

import {
  AssistantModalPrimitive,
  AssistantRuntimeProvider,
} from '@assistant-ui/react';
import {
  AssistantChatTransport,
  useChatRuntime,
} from '@assistant-ui/react-ai-sdk';
import type { UIMessage } from 'ai';
import { BotIcon, ChevronDownIcon } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import { Thread } from '@/components/assistant-ui/thread';
import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';
import { getDeviceId } from '@/lib/device-id';

// ── Storage keys ──────────────────────────────────────────────────────────────
// Keyed by device ID so each browser keeps its own conversation.
function storageKey(deviceId: string) {
  return `ask-moaaz:${deviceId}`;
}

interface PersistedChat {
  sessionId: string;
  messages: UIMessage[];
}

function loadPersistedChat(deviceId: string): PersistedChat | null {
  try {
    const raw = localStorage.getItem(storageKey(deviceId));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedChat;
  } catch {
    return null;
  }
}

function savePersistedChat(deviceId: string, data: PersistedChat) {
  try {
    localStorage.setItem(storageKey(deviceId), JSON.stringify(data));
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
}

// ── Public state interface ────────────────────────────────────────────────────

interface AssistantPublicState {
  enabled: boolean;
  name: string;
  greeting: string;
  suggestedPrompts: string[];
}

// ── Root widget (checks enabled state) ───────────────────────────────────────

export function AskMoaazWidget() {
  const [state, setState] = useState<AssistantPublicState | null>(null);
  const [error, setError] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/assistant/config');
      if (!res.ok) throw new Error();
      const data: AssistantPublicState = await res.json();
      setState(data);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  if (error || !state || !state.enabled) return null;

  return <AskMoaazInner state={state} />;
}

// ── Inner widget (runtime + persistence) ─────────────────────────────────────

function AskMoaazInner({ state }: { state: AssistantPublicState }) {
  const [open, setOpen] = useState(false);

  // Resolved on first client render from localStorage
  const deviceIdRef = useRef<string>('');
  const sessionIdRef = useRef<string | undefined>(undefined);

  // Load persisted chat from localStorage before the runtime is created.
  // This runs only on the client (useRef/useState are SSR-safe here because
  // this component is only rendered inside a useEffect-gated path).
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

  // Custom fetch that:
  // 1. Attaches deviceId + sessionId to every request body
  // 2. Reads x-chat-session-id from the response and persists it
  // 3. After the stream completes, saves all messages to localStorage
  const customFetch: typeof fetch = useCallback(async (input, init) => {
    // Patch the request body with our session metadata
    const originalBody = init?.body ? JSON.parse(init.body as string) : {};
    const patchedBody = {
      ...originalBody,
      deviceId: deviceIdRef.current,
      sessionId: sessionIdRef.current,
      pagePath: window.location.pathname,
    };
    const patchedInit: RequestInit = {
      ...(init ?? {}),
      body: JSON.stringify(patchedBody),
    };

    const response = await fetch(input, patchedInit);

    // Read the session ID the server assigned (or confirmed)
    const newSessionId = response.headers.get('x-chat-session-id');
    if (newSessionId) {
      sessionIdRef.current = newSessionId;
    }

    return response;
  }, []);

  const runtime = useChatRuntime({
    messages: initialMessages,
    transport: new AssistantChatTransport({
      api: '/api/chat',
      fetch: customFetch,
    }),
  });

  // Subscribe to thread changes and persist messages to localStorage
  useEffect(() => {
    const thread = runtime.thread;
    return thread.subscribe(() => {
      const state = thread.getState();
      const msgs = state.messages;
      // Only persist once the thread has messages and we have a session
      if (!msgs.length || !sessionIdRef.current || !deviceIdRef.current) return;

      // Convert ThreadMessage[] → UIMessage[] (only text content, role, id)
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

  // Listen for navbar "Ask Moaaz" button click
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('ask-moaaz-open', handler);
    return () => window.removeEventListener('ask-moaaz-open', handler);
  }, []);

  function handleClear() {
    if (deviceIdRef.current) {
      try {
        localStorage.removeItem(storageKey(deviceIdRef.current));
      } catch {
        // ignore
      }
    }
    sessionIdRef.current = undefined;
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantModalPrimitive.Root open={open} onOpenChange={setOpen}>
        <AssistantModalPrimitive.Anchor className="aui-root aui-modal-anchor fixed right-4 bottom-4 size-11">
          <AssistantModalPrimitive.Trigger asChild>
            <ModalButton />
          </AssistantModalPrimitive.Trigger>
        </AssistantModalPrimitive.Anchor>
        <AssistantModalPrimitive.Content
          sideOffset={16}
          className="aui-root aui-modal-content data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 data-[state=closed]:zoom-out data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=open]:zoom-in bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in z-50 h-125 w-100 overflow-clip overscroll-contain rounded-xl border p-0 shadow-md outline-none [&>.aui-thread-root]:bg-inherit [&>.aui-thread-root_.aui-thread-viewport-footer]:bg-inherit"
        >
          <Thread
            welcome={{
              name: state.name,
              greeting: state.greeting,
              prompts: state.suggestedPrompts,
            }}
            onClear={handleClear}
          />
        </AssistantModalPrimitive.Content>
      </AssistantModalPrimitive.Root>
    </AssistantRuntimeProvider>
  );
}

// ── Modal toggle button ───────────────────────────────────────────────────────

type ModalButtonProps = { 'data-state'?: 'open' | 'closed' };

const ModalButton = forwardRef<HTMLButtonElement, ModalButtonProps>(
  ({ 'data-state': state, ...rest }, ref) => {
    const tooltip = state === 'open' ? 'Close Assistant' : 'Ask Moaaz';

    return (
      <TooltipIconButton
        variant="default"
        tooltip={tooltip}
        side="left"
        {...rest}
        className="aui-modal-button size-full rounded-full shadow transition-transform hover:scale-110 active:scale-90"
        ref={ref}
      >
        <BotIcon
          data-state={state}
          className="aui-modal-button-closed-icon absolute size-6 transition-all data-[state=closed]:scale-100 data-[state=closed]:rotate-0 data-[state=open]:scale-0 data-[state=open]:rotate-90"
        />
        <ChevronDownIcon
          data-state={state}
          className="aui-modal-button-open-icon absolute size-6 transition-all data-[state=closed]:scale-0 data-[state=closed]:-rotate-90 data-[state=open]:scale-100 data-[state=open]:rotate-0"
        />
        <span className="sr-only">{tooltip}</span>
      </TooltipIconButton>
    );
  },
);

ModalButton.displayName = 'ModalButton';
