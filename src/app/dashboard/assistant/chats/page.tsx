import {
  getChatAnalyticsSummary,
  getChatSessions,
} from '@/lib/actions/assistant';

import { ChatAnalyticsClient } from './chat-analytics-client';

export default async function ChatsPage() {
  const [summaryResult, sessionsResult] = await Promise.all([
    getChatAnalyticsSummary(),
    getChatSessions({ page: 1, limit: 20 }),
  ]);

  if (summaryResult.error || sessionsResult.error) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-xl font-semibold">Unable to Load Analytics</h2>
        <p className="text-muted-foreground mt-2">
          {summaryResult.error ?? sessionsResult.error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Chat History</h2>
        <p className="text-muted-foreground">
          Review visitor conversations, spot patterns, and improve the
          assistant.
        </p>
      </div>
      <ChatAnalyticsClient
        initialSummary={summaryResult.data!}
        initialSessions={sessionsResult.data!}
        initialPagination={sessionsResult.pagination!}
      />
    </div>
  );
}
