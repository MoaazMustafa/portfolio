'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
    assistantConfigSchema,
    assistantKnowledgeSchema,
    type AssistantConfigFormValues,
    type AssistantKnowledgeFormValues,
} from '@/lib/validations/assistant';

// ── Helpers ──

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: 'You must be signed in' };
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  if (user?.role !== 'ADMIN') {
    return { error: 'Admin access required' };
  }
  return { ok: true };
}

// ── Assistant Config ──

export async function getAssistantConfigAction() {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const config = await prisma.assistantConfig.findUnique({
    where: { id: 'default' },
  });

  return { data: config };
}

export async function updateAssistantConfig(data: AssistantConfigFormValues) {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const result = assistantConfigSchema.safeParse(data);
  if (!result.success) return { error: 'Invalid data' };

  try {
    await prisma.assistantConfig.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...result.data },
      update: result.data,
    });

    revalidatePath('/dashboard/assistant');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed to update assistant config' };
  }
}

// ── Knowledge Entries ──

export async function listKnowledgeEntries() {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const entries = await prisma.assistantKnowledge.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });

  return { data: entries };
}

export async function createKnowledgeEntry(data: AssistantKnowledgeFormValues) {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const result = assistantKnowledgeSchema.safeParse(data);
  if (!result.success) return { error: 'Invalid data' };

  try {
    await prisma.assistantKnowledge.create({ data: result.data });
    revalidatePath('/dashboard/assistant');
    return { success: true };
  } catch {
    return { error: 'Failed to create knowledge entry' };
  }
}

export async function updateKnowledgeEntry(
  id: string,
  data: AssistantKnowledgeFormValues,
) {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const result = assistantKnowledgeSchema.safeParse(data);
  if (!result.success) return { error: 'Invalid data' };

  try {
    await prisma.assistantKnowledge.update({
      where: { id },
      data: result.data,
    });
    revalidatePath('/dashboard/assistant');
    return { success: true };
  } catch {
    return { error: 'Failed to update knowledge entry' };
  }
}

export async function deleteKnowledgeEntry(id: string) {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  try {
    await prisma.assistantKnowledge.delete({ where: { id } });
    revalidatePath('/dashboard/assistant');
    return { success: true };
  } catch {
    return { error: 'Failed to delete knowledge entry' };
  }
}

// ── Chat Analytics ──

export async function getChatSessions(opts?: {
  page?: number;
  limit?: number;
  refusalsOnly?: boolean;
}) {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where = opts?.refusalsOnly
    ? { messages: { some: { isRefusal: true } } }
    : {};

  const [sessions, total] = await Promise.all([
    prisma.chatSession.findMany({
      where,
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.chatSession.count({ where }),
  ]);

  return {
    data: sessions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getChatAnalyticsSummary() {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const [totalSessions, totalMessages, totalRefusals, recentSessions] =
    await Promise.all([
      prisma.chatSession.count(),
      prisma.chatMessage.count(),
      prisma.chatMessage.count({ where: { isRefusal: true } }),
      prisma.chatSession.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

  return {
    data: { totalSessions, totalMessages, totalRefusals, recentSessions },
  };
}

export async function deleteChatSession(id: string) {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  try {
    await prisma.chatSession.delete({ where: { id } });
    revalidatePath('/dashboard/assistant/chats');
    return { success: true };
  } catch {
    return { error: 'Failed to delete chat session' };
  }
}
