'use client';

import type { ChatMessage, ChatSession } from '@prisma/client';
import {
  AlertTriangle,
  CheckSquare2,
  Globe,
  Info,
  MessageCircle,
  MessageSquare,
  Monitor,
  Search,
  ShieldAlert,
  Smartphone,
  Square,
  Tablet,
  Trash2,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { deleteChatSession, getChatSessions } from '@/lib/actions/assistant';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────

type SessionWithMessages = ChatSession & { messages: ChatMessage[] };

interface ChatAnalyticsClientProps {
  initialSummary: {
    totalSessions: number;
    totalMessages: number;
    totalRefusals: number;
    recentSessions: number;
  };
  initialSessions: SessionWithMessages[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type RightView = 'chat' | 'info';

// ── Root component ─────────────────────────────────────────────────────────────

export function ChatAnalyticsClient({
  initialSummary,
  initialSessions,
  initialPagination,
}: ChatAnalyticsClientProps) {
  const [sessions, setSessions] =
    useState<SessionWithMessages[]>(initialSessions);
  const [pagination, setPagination] = useState(initialPagination);
  const [selected, setSelected] = useState<string | null>(
    initialSessions[0]?.id ?? null,
  );
  const [rightView, setRightView] = useState<RightView>('chat');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadPage(page: number) {
    setLoading(true);
    try {
      const result = await getChatSessions({ page, limit: pagination.limit });
      if (result.data) {
        setSessions(result.data as SessionWithMessages[]);
        if (result.pagination) setPagination(result.pagination);
        setSelected((result.data as SessionWithMessages[])[0]?.id ?? null);
        setChecked(new Set());
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteSelected() {
    for (const id of checked) {
      const res = await deleteChatSession(id);
      if (res.error) toast.error(res.error);
    }
    setSessions((prev) => {
      const next = prev.filter((s) => !checked.has(s.id));
      if (selected && checked.has(selected)) setSelected(next[0]?.id ?? null);
      return next;
    });
    setChecked(new Set());
    toast.success(
      `Deleted ${checked.size} session${checked.size > 1 ? 's' : ''}`,
    );
  }

  function toggleCheck(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const filtered = sessions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.visitorId?.toLowerCase().includes(q) ||
      s.pagePath?.toLowerCase().includes(q) ||
      s.browserName?.toLowerCase().includes(q) ||
      s.osName?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.country?.toLowerCase().includes(q) ||
      s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  const activeSession =
    filtered.find((s) => s.id === selected) ?? filtered[0] ?? null;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Sessions"
          value={initialSummary.totalSessions}
          icon={<MessageCircle className="size-4" />}
        />
        <StatCard
          label="Messages"
          value={initialSummary.totalMessages}
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          label="Refusals"
          value={initialSummary.totalRefusals}
          icon={<ShieldAlert className="size-4" />}
        />
        <StatCard
          label="Last 7 Days"
          value={initialSummary.recentSessions}
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      {/* WhatsApp-style split layout */}
      <div className="border-border flex h-[calc(100vh-18rem)] overflow-hidden rounded-xl border">
        {/* ── Left panel ── */}
        <div className="border-border flex w-72 shrink-0 flex-col border-r">
          {/* Search + bulk-delete toolbar */}
          <div className="border-border space-y-1.5 border-b p-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="h-8 pl-8 text-xs"
              />
            </div>
            {checked.size > 0 && (
              <div className="bg-destructive/10 flex items-center justify-between rounded-md px-2 py-1">
                <span className="text-destructive text-[11px] font-medium">
                  {checked.size} selected
                </span>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 gap-1 px-2 text-xs"
                  onClick={deleteSelected}
                >
                  <Trash2 className="size-3" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Session rows */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground p-4 text-center text-xs">
                No conversations found.
              </p>
            ) : (
              filtered.map((session) => {
                const preview =
                  session.messages.find((m) => m.role === 'user')?.content ??
                  '(empty)';
                const hasRefusal = session.messages.some((m) => m.isRefusal);
                const isActive = session.id === activeSession?.id;
                const isChecked = checked.has(session.id);

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      setSelected(session.id);
                      setRightView('chat');
                    }}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 border-b px-2 py-2.5 transition-colors',
                      isActive ? 'bg-primary/8' : 'hover:bg-muted/50',
                      isChecked && 'bg-destructive/5',
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => toggleCheck(session.id, e)}
                      className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare2 className="text-destructive size-4" />
                      ) : (
                        <Square className="size-4" />
                      )}
                    </button>

                    {/* Device avatar */}
                    <DeviceIcon type={session.deviceType} active={isActive} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-semibold">
                          {session.visitorId
                            ? `Device ${session.visitorId.slice(0, 8)}`
                            : 'Unknown'}
                        </span>
                        {hasRefusal && (
                          <Badge
                            variant="destructive"
                            className="h-4 px-1 text-[9px]"
                          >
                            !
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground truncate text-[11px]">
                        {preview}
                      </p>
                      <p className="text-muted-foreground/60 mt-0.5 text-[10px]">
                        {session.browserName ? `${session.browserName} · ` : ''}
                        {new Date(session.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                        {' · '}
                        {session.messages.length} msg
                        {session.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="border-border flex items-center justify-between border-t px-3 py-2">
              <span className="text-muted-foreground text-[10px]">
                {pagination.page}/{pagination.totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => loadPage(pagination.page - 1)}
                >
                  ←
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => loadPage(pagination.page + 1)}
                >
                  →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeSession ? (
            <>
              {/* Header: Info toggle + Close */}
              <div className="border-border flex items-center justify-between border-b px-4 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {activeSession.visitorId
                      ? `Device ${activeSession.visitorId.slice(0, 8)}`
                      : 'Unknown device'}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {[activeSession.city, activeSession.country]
                      .filter(Boolean)
                      .join(', ') ||
                      activeSession.pagePath ||
                      new Date(activeSession.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="sm"
                    variant={rightView === 'info' ? 'secondary' : 'ghost'}
                    className="h-7 w-7 p-0"
                    title="Visitor info"
                    onClick={() =>
                      setRightView(rightView === 'info' ? 'chat' : 'info')
                    }
                  >
                    <Info className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    title="Close"
                    onClick={() => setSelected(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {rightView === 'info' ? (
                <InfoPanel session={activeSession} />
              ) : (
                <ChatPanel session={activeSession} />
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <MessageSquare className="text-muted-foreground/30 size-14" />
              <p className="text-muted-foreground text-sm">
                Select a conversation to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Chat panel ─────────────────────────────────────────────────────────────────

function ChatPanel({ session }: { session: SessionWithMessages }) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {session.messages.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          No messages.
        </p>
      ) : (
        session.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cn(
                'max-w-[72%] rounded-2xl px-3 py-2 shadow-sm',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm',
                msg.isRefusal && 'border-destructive/60 border',
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              <div
                className={cn(
                  'mt-1 flex items-center gap-1.5',
                  msg.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                {msg.isRefusal && (
                  <Badge variant="destructive" className="h-4 px-1 text-[9px]">
                    Off-topic
                  </Badge>
                )}
                <span className="text-[10px] opacity-60">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Info panel ─────────────────────────────────────────────────────────────────

function InfoPanel({ session }: { session: SessionWithMessages }) {
  const rows: {
    label: string;
    value: string | null | undefined;
    icon?: React.ReactNode;
  }[] = [
    {
      label: 'Device ID',
      value: session.visitorId,
      icon: <User className="size-3.5" />,
    },
    {
      label: 'IP Address',
      value: session.ipAddress,
      icon: <Globe className="size-3.5" />,
    },
    { label: 'Country', value: session.country },
    { label: 'Region', value: session.region },
    { label: 'City', value: session.city },
    {
      label: 'Browser',
      value:
        [session.browserName, session.browserVersion]
          .filter(Boolean)
          .join(' ') || null,
    },
    {
      label: 'OS',
      value:
        [session.osName, session.osVersion].filter(Boolean).join(' ') || null,
    },
    { label: 'Device Type', value: session.deviceType },
    { label: 'Page', value: session.pagePath },
    { label: 'Referrer', value: session.referrer },
    {
      label: 'Provider / Model',
      value:
        [session.provider, session.model].filter(Boolean).join(' · ') || null,
    },
    {
      label: 'Session Start',
      value: new Date(session.createdAt).toLocaleString(),
    },
    {
      label: 'Last Activity',
      value: new Date(session.updatedAt).toLocaleString(),
    },
    { label: 'Messages', value: String(session.messages.length) },
    {
      label: 'Refusals',
      value: String(session.messages.filter((m) => m.isRefusal).length),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="rounded-xl border">
        {session.userAgent && (
          <div className="border-b px-4 py-3">
            <p className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-wider uppercase">
              User Agent
            </p>
            <p className="text-muted-foreground text-xs break-all">
              {session.userAgent}
            </p>
          </div>
        )}
        <dl className="divide-y">
          {rows.map(({ label, value, icon }) =>
            value ? (
              <div
                key={label}
                className="flex items-center justify-between gap-4 px-4 py-2.5"
              >
                <dt className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs">
                  {icon}
                  {label}
                </dt>
                <dd className="truncate text-right text-xs font-medium">
                  {value}
                </dd>
              </div>
            ) : null,
          )}
        </dl>
      </div>
    </div>
  );
}

// ── Device icon ────────────────────────────────────────────────────────────────

function DeviceIcon({
  type,
  active,
}: {
  type: string | null | undefined;
  active: boolean;
}) {
  const cls = cn(
    'flex size-8 shrink-0 items-center justify-center rounded-full',
    active
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted text-muted-foreground',
  );
  return (
    <div className={cls}>
      {type === 'mobile' ? (
        <Smartphone className="size-4" />
      ) : type === 'tablet' ? (
        <Tablet className="size-4" />
      ) : (
        <Monitor className="size-4" />
      )}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-5 pb-4">
        <div className="bg-primary/10 text-primary rounded-md p-2">{icon}</div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
