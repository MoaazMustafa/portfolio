'use client';

import type { ChatMessage, ChatSession } from '@prisma/client';
import {
  AlertTriangle,
  MessageCircle,
  MessageSquare,
  Search,
  ShieldAlert,
  Trash2,
  TrendingUp,
  User,
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

// ── Root component ─────────────────────────────────────────────────────────────

export function ChatAnalyticsClient({
  initialSummary,
  initialSessions,
  initialPagination,
}: ChatAnalyticsClientProps) {
  const [sessions, setSessions] = useState<SessionWithMessages[]>(initialSessions);
  const [pagination, setPagination] = useState(initialPagination);
  const [selected, setSelected] = useState<string | null>(
    initialSessions[0]?.id ?? null,
  );
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const summary = initialSummary;

  async function loadPage(page: number) {
    setLoading(true);
    try {
      const result = await getChatSessions({ page, limit: pagination.limit });
      if (result.data) {
        setSessions(result.data as SessionWithMessages[]);
        if (result.pagination) setPagination(result.pagination);
        setSelected((result.data as SessionWithMessages[])[0]?.id ?? null);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await deleteChatSession(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (selected === id) setSelected(next[0]?.id ?? null);
        return next;
      });
      toast.success('Session deleted');
    }
  }

  const filtered = sessions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.visitorId?.toLowerCase().includes(q) ||
      s.pagePath?.toLowerCase().includes(q) ||
      s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  const activeSession = filtered.find((s) => s.id === selected) ?? filtered[0] ?? null;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Sessions" value={summary.totalSessions} icon={<MessageCircle className="size-4" />} />
        <StatCard label="Messages" value={summary.totalMessages} icon={<TrendingUp className="size-4" />} />
        <StatCard label="Refusals" value={summary.totalRefusals} icon={<ShieldAlert className="size-4" />} />
        <StatCard label="Last 7 Days" value={summary.recentSessions} icon={<AlertTriangle className="size-4" />} />
      </div>

      {/* WhatsApp-style split layout */}
      <div className="border-border flex h-[calc(100vh-18rem)] overflow-hidden rounded-xl border">

        {/* ── Left panel — session list ─────────────────────────────── */}
        <div className="border-border flex w-72 shrink-0 flex-col border-r">
          {/* Search */}
          <div className="border-border border-b p-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Session rows */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground p-4 text-center text-xs">
                No conversations found.
              </p>
            ) : (
              filtered.map((session) => {
                const preview = session.messages.find((m) => m.role === 'user')?.content ?? '(empty)';
                const hasRefusal = session.messages.some((m) => m.isRefusal);
                const isActive = session.id === activeSession?.id;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelected(session.id)}
                    className={cn(
                      'flex w-full items-center gap-3 border-b px-3 py-2.5 text-left transition-colors',
                      isActive ? 'bg-primary/8' : 'hover:bg-muted/50',
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    )}>
                      <User className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-semibold">
                          {session.visitorId
                            ? `Device ${session.visitorId.slice(0, 8)}`
                            : 'Unknown'}
                        </span>
                        {hasRefusal && (
                          <Badge variant="destructive" className="h-4 px-1 text-[9px]">!</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground truncate text-[11px]">{preview}</p>
                      <p className="text-muted-foreground/60 mt-0.5 text-[10px]">
                        {new Date(session.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric',
                        })}
                        {' · '}
                        {session.messages.length} msg{session.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </button>
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
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => loadPage(pagination.page - 1)}>←</Button>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => loadPage(pagination.page + 1)}>→</Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel — message thread ─────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeSession ? (
            <>
              {/* Header */}
              <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
                <div>
                  <p className="text-sm font-semibold">
                    {activeSession.visitorId
                      ? `Device ${activeSession.visitorId.slice(0, 8)}`
                      : 'Unknown device'}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {activeSession.pagePath && <>{activeSession.pagePath} · </>}
                    {new Date(activeSession.createdAt).toLocaleString()}
                    {activeSession.provider && ` · ${activeSession.provider}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(activeSession.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {activeSession.messages.length === 0 ? (
                  <p className="text-muted-foreground py-12 text-center text-sm">No messages.</p>
                ) : (
                  activeSession.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex',
                        msg.role === 'user' ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[72%] rounded-2xl px-3 py-2 text-sm shadow-sm',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted text-foreground rounded-bl-sm',
                          msg.isRefusal && 'border border-destructive/60',
                        )}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content}
                        </p>
                        <div className={cn(
                          'mt-1 flex items-center gap-1.5',
                          msg.role === 'user' ? 'justify-end' : 'justify-start',
                        )}>
                          {msg.isRefusal && (
                            <Badge variant="destructive" className="h-4 px-1 text-[9px]">
                              Off-topic
                            </Badge>
                          )}
                          <span className={cn(
                            'text-[10px] opacity-60',
                          )}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <MessageSquare className="text-muted-foreground/30 size-14" />
              <p className="text-muted-foreground text-sm">
                Select a conversation to view messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
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
