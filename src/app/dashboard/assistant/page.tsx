import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import { AssistantSettingsClient } from './assistant-settings-client';

export default async function AssistantPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-xl font-semibold">Unable to Load Settings</h2>
        <p className="text-muted-foreground mt-2">
          You must be signed in to manage assistant settings.
        </p>
      </div>
    );
  }

  const config = await prisma.assistantConfig.findUnique({
    where: { id: 'default' },
  });

  const knowledge = await prisma.assistantKnowledge.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ask Moaaz</h2>
        <p className="text-muted-foreground">
          Manage your AI twin — configure behavior, knowledge base, and
          review analytics.
        </p>
      </div>
      <AssistantSettingsClient
        initialConfig={
          config
            ? {
                enabled: config.enabled,
                name: config.name,
                greeting: config.greeting,
                systemPrompt: config.systemPrompt ?? '',
                refusalMessage: config.refusalMessage,
                suggestedPrompts: config.suggestedPrompts,
                providerMode: config.providerMode as 'hosted' | 'local',
              }
            : null
        }
        initialKnowledge={knowledge}
      />
    </div>
  );
}
