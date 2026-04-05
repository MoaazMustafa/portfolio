import { createOpenAI } from '@ai-sdk/openai';
import type { TextUIPart, UIMessage } from 'ai';
// eslint-disable-next-line no-duplicate-imports
import { convertToModelMessages, streamText } from 'ai';

import { getAssistantConfig } from '@/lib/assistant';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** Extract plain text from a UIMessage parts array (AI SDK v6). */
function extractText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is TextUIPart => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

function getProvider(mode: string) {
  if (mode === 'local') {
    // Ollama exposes an OpenAI-compatible API — use .chat() to force /chat/completions
    return createOpenAI({
      baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
      apiKey: 'ollama',
    });
  }

  // Hosted: OpenRouter / Groq — both only support /chat/completions
  const baseURL = process.env.AI_BASE_URL ?? 'https://openrouter.ai/api/v1';
  const apiKey = process.env.AI_API_KEY ?? '';

  return createOpenAI({ baseURL, apiKey });
}

function getModelId(mode: string): string {
  if (mode === 'local') {
    return process.env.OLLAMA_MODEL ?? 'llama3.2';
  }
  return process.env.AI_MODEL ?? 'google/gemma-3-4b-it:free';
}

export async function POST(req: Request) {
  try {
    const config = await getAssistantConfig();

    if (!config.enabled) {
      return Response.json(
        { error: 'Ask Moaaz is currently disabled.' },
        { status: 503 },
      );
    }

    const body = await req.json();
    const messages: UIMessage[] = body.messages ?? [];
    const sessionId: string | undefined = body.sessionId;
    const pagePath: string | undefined = body.pagePath;

    if (!messages.length) {
      return Response.json({ error: 'No messages provided' }, { status: 400 });
    }

    const provider = getProvider(config.providerMode);
    const modelId = getModelId(config.providerMode);

    // Persist the chat session + new user message
    let chatSessionId = sessionId;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');

    if (lastUserMessage) {
      const userText = extractText(lastUserMessage);
      if (!chatSessionId) {
        const session = await prisma.chatSession.create({
          data: {
            pagePath,
            provider: config.providerMode,
            model: modelId,
            userAgent: req.headers.get('user-agent') ?? undefined,
          },
        });
        chatSessionId = session.id;
      }

      if (userText) {
        await prisma.chatMessage.create({
          data: {
            sessionId: chatSessionId,
            role: 'user',
            content: userText,
          },
        });
      }
    }

    const result = streamText({
      model: provider.chat(modelId),  // .chat() uses /chat/completions, not /responses
      system: config.systemPrompt,
      messages: await convertToModelMessages(messages),
      temperature: 0.3,
      async onFinish({ text }) {
        if (chatSessionId && text) {
          // Detect refusals — simple heuristic based on refusal keywords
          const refusalPatterns = [
            'only answer questions about moaaz',
            'can only help with questions about moaaz',
            "can't help with that",
            'try asking something about him',
            'ask me about moaaz',
          ];
          const isRefusal = refusalPatterns.some((p) =>
            text.toLowerCase().includes(p),
          );

          await prisma.chatMessage.create({
            data: {
              sessionId: chatSessionId,
              role: 'assistant',
              content: text,
              isRefusal,
            },
          });
        }
      },
    });

    const response = result.toUIMessageStreamResponse();

    // Attach the session ID in a custom header so the client can persist it
    if (chatSessionId) {
      response.headers.set('x-chat-session-id', chatSessionId);
    }

    return response;
  } catch (error) {
    console.error('[Ask Moaaz] Chat error:', error);
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 },
    );
  }
}
