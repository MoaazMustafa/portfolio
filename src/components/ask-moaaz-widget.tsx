'use client';

import { AssistantModalPrimitive, AssistantRuntimeProvider } from '@assistant-ui/react';
import {
  AssistantChatTransport,
  useChatRuntime,
} from '@assistant-ui/react-ai-sdk';
import { BotIcon, ChevronDownIcon } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useState } from 'react';

import { Thread } from '@/components/assistant-ui/thread';
import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';

interface AssistantPublicState {
  enabled: boolean;
  name: string;
  greeting: string;
  suggestedPrompts: string[];
}

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

  // Don't render anything until we know the state
  if (error || !state || !state.enabled) return null;

  return <AskMoaazInner state={state} />;
}

function AskMoaazInner({ state }: { state: AssistantPublicState }) {
  const [open, setOpen] = useState(false);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: '/api/chat',
    }),
  });

  // Listen for navbar "Ask Moaaz" button click
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('ask-moaaz-open', handler);
    return () => window.removeEventListener('ask-moaaz-open', handler);
  }, []);

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
          className="aui-root aui-modal-content data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 data-[state=closed]:zoom-out data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=open]:zoom-in z-50 h-125 w-100 overflow-clip overscroll-contain rounded-xl border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in [&>.aui-thread-root]:bg-inherit [&>.aui-thread-root_.aui-thread-viewport-footer]:bg-inherit"
        >
          <Thread welcome={{ name: state.name, greeting: state.greeting, prompts: state.suggestedPrompts }} />
        </AssistantModalPrimitive.Content>
      </AssistantModalPrimitive.Root>
    </AssistantRuntimeProvider>
  );
}

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
          className="aui-modal-button-closed-icon absolute size-6 transition-all data-[state=closed]:rotate-0 data-[state=open]:rotate-90 data-[state=closed]:scale-100 data-[state=open]:scale-0"
        />
        <ChevronDownIcon
          data-state={state}
          className="aui-modal-button-open-icon absolute size-6 transition-all data-[state=closed]:-rotate-90 data-[state=open]:rotate-0 data-[state=closed]:scale-0 data-[state=open]:scale-100"
        />
        <span className="sr-only">{tooltip}</span>
      </TooltipIconButton>
    );
  },
);

ModalButton.displayName = 'ModalButton';
