import { prisma } from '@/lib/prisma';

import { defaultKnowledge, defaultSystemPrompt } from './knowledge';

export interface AssistantSettings {
  enabled: boolean;
  name: string;
  greeting: string;
  systemPrompt: string;
  refusalMessage: string;
  suggestedPrompts: string[];
  providerMode: string;
}

/**
 * Load assistant config from the database, falling back to defaults.
 */
export async function getAssistantConfig(): Promise<AssistantSettings> {
  const config = await prisma.assistantConfig.findUnique({
    where: { id: 'default' },
  });

  const knowledge = await getKnowledgeBlock();

  const systemPrompt = (config?.systemPrompt ?? defaultSystemPrompt).replace(
    '{KNOWLEDGE_BLOCK}',
    knowledge,
  );

  return {
    enabled: config?.enabled ?? true,
    name: config?.name ?? 'Moaaz',
    greeting:
      config?.greeting ??
      "Hey! I'm Moaaz's AI twin. Ask me anything about him — skills, projects, experience, or what he's working on.",
    systemPrompt,
    refusalMessage:
      config?.refusalMessage ??
      "I can only answer questions about Moaaz — his work, skills, projects, and experience. Try asking something about him!",
    suggestedPrompts:
      config?.suggestedPrompts?.length
        ? config.suggestedPrompts
        : [
            'Who is Moaaz?',
            'What tech stack does he use?',
            'Tell me about his projects',
            'How can I contact him?',
          ],
    providerMode: config?.providerMode ?? 'hosted',
  };
}

/**
 * Build the knowledge block from DB entries (priority-sorted),
 * falling back to the default file-based knowledge.
 */
async function getKnowledgeBlock(): Promise<string> {
  const dbEntries = await prisma.assistantKnowledge.findMany({
    where: { enabled: true },
    orderBy: { priority: 'desc' },
  });

  const entries =
    dbEntries.length > 0
      ? dbEntries
      : defaultKnowledge.map((e) => ({
          ...e,
          id: e.title,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

  return entries
    .map((e) => `## ${e.title} [${e.category}]\n${e.content}`)
    .join('\n\n');
}

/**
 * Lightweight check for the public client — returns only
 * the fields the floating widget needs to render.
 */
export async function getAssistantPublicState() {
  const config = await prisma.assistantConfig.findUnique({
    where: { id: 'default' },
    select: {
      enabled: true,
      name: true,
      greeting: true,
      suggestedPrompts: true,
    },
  });

  return {
    enabled: config?.enabled ?? true,
    name: config?.name ?? 'Moaaz',
    greeting:
      config?.greeting ??
      "Hey! I'm Moaaz's AI twin. Ask me anything about him — skills, projects, experience, or what he's working on.",
    suggestedPrompts:
      config?.suggestedPrompts?.length
        ? config.suggestedPrompts
        : [
            'Who is Moaaz?',
            'What tech stack does he use?',
            'Tell me about his projects',
            'How can I contact him?',
          ],
  };
}
