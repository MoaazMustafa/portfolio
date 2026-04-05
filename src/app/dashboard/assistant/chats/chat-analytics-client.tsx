'use client';

import type { ChatMessage, ChatSession } from '@prisma/client';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShieldAlert,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteChatSession, getChatSessions } from '@/lib/actions/assistant';
import { cn } from '@/lib/utils';

// ── Types ──

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

// ── Component ──

export function ChatAnalyticsClient({
  initialSummary,
  initialSessions,
  initialPagination,
}: ChatAnalyticsClientProps) {
  const [sessions, setSessions] =
    useState<SessionWithMessages[]>(initialSessions);
  const [pagination, setPagination] = useState(initialPagination);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const summary = initialSummary;

  async function loadPage(page: number) {
    setLoading(true);
    try {
      const result = await getChatSessions({ page, limit: pagination.limit });
      if (result.data) {
        setSessions(result.data as SessionWithMessages[]);
        setPagination(result.pagination!);
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total Sessions"
          value={summary.totalSessions}
          icon={<MessageCircle className="h-4 w-4" />}
        />
        <StatCard
          label="Total Messages"
          value={summary.totalMessages}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Refusals"
          value={summary.totalRefusals}
          icon={<ShieldAlert className="h-4 w-4" />}
        />
        <StatCard
          label="Last 7 Days"
          value={summary.recentSessions}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Session List */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No chat sessions recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const isExpanded = expanded.has(session.id);
                const hasRefusal = session.messages.some((m) => m.isRefusal);
                const visitorLabel = session.visitorId
                  ? `Device ${session.visitorId.slice(0, 8)}`
                  : 'Unknown device';
                return (
                  <div key={session.id} className="rounded-lg border">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between p-4 text-left"
                      onClick={() => toggleExpand(session.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">
                            {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-muted-foreground text-xs font-mono">
                            {visitorLabel}
                          </span>
                          {session.pagePath && (
                            <span className="text-muted-foreground text-xs">
                              from {session.pagePath}
                            </span>
                          )}
                          {hasRefusal && (
                            <Badge variant="destructive" className="text-xs">
                              Off-topic
                            </Badge>
                          )}
                          {session.provider && (
                            <Badge variant="outline" className="text-xs">
                              {session.provider}
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          Started {new Date(session.createdAt).toLocaleString()}
                          {session.updatedAt && session.updatedAt > session.createdAt && (
                            <> · Last message {new Date(session.updatedAt).toLocaleString()}</>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const res = await deleteChatSession(session.id);
                            if (res.error) {
                              toast.error(res.error);
                            } else {
                              setSessions((prev) =>
                                prev.filter((s) => s.id !== session.id),
                              );
                              toast.success('Session deleted');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t px-4 py-3">
                        <div className="space-y-2">
                          {session.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                'rounded-md p-3 text-sm',
                                msg.role === 'user'
                                  ? 'bg-muted ml-8'
                                  : 'bg-primary/5 mr-8',
                                msg.isRefusal && 'border-destructive border',
                              )}
                            >
                              <div className="mb-1 flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {msg.role}
                                </Badge>
                                {msg.isRefusal && (
                                  <Badge
                                    variant="destructive"
                                    className="text-[10px]"
                                  >
                                    Refusal
                                  </Badge>
                                )}
                                <span className="text-muted-foreground text-[10px]">
                                  {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="whitespace-pre-wrap">
                                {msg.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => loadPage(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => loadPage(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Stat Card ──

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
      <CardContent className="flex items-center gap-3 pt-6">
        <div className="bg-primary/10 text-primary rounded-md p-2">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
