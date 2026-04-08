import { createOpenAI } from '@ai-sdk/openai';
import type { TextUIPart, UIMessage } from 'ai';
// eslint-disable-next-line no-duplicate-imports
import { convertToModelMessages, streamText } from 'ai';
import { toast } from 'sonner';

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
    return createOpenAI({
      baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
      apiKey: 'ollama',
    });
  }
  const baseURL = process.env.AI_BASE_URL ?? 'https://openrouter.ai/api/v1';
  const apiKey = process.env.AI_API_KEY ?? '';
  return createOpenAI({ baseURL, apiKey });
}

function getModelId(mode: string): string {
  if (mode === 'local') return process.env.OLLAMA_MODEL ?? 'llama3.2';
  return process.env.AI_MODEL ?? 'google/gemma-3-4b-it:free';
}

// ── Lightweight User-Agent parser ─────────────────────────────────────────────

interface UAInfo {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

function parseUA(ua: string): UAInfo {
  const s = ua.toLowerCase();

  // Device type
  const isMobile = /mobile|android.*mobile|iphone|ipod|blackberry|windows phone/.test(s);
  const isTablet = /tablet|ipad|android(?!.*mobile)/.test(s);
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  // OS
  let osName = 'Unknown';
  let osVersion = '';
  if (/windows nt/.test(s)) {
    osName = 'Windows';
    const m = s.match(/windows nt ([\d.]+)/);
    const ver = m?.[1];
    const map: Record<string, string> = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista' };
    osVersion = (ver && map[ver]) ? map[ver] : (ver ?? '');
  } else if (/mac os x/.test(s)) {
    osName = 'macOS';
    const m = s.match(/mac os x ([\d_]+)/);
    osVersion = m?.[1]?.replace(/_/g, '.') ?? '';
  } else if (/android/.test(s)) {
    osName = 'Android';
    const m = s.match(/android ([\d.]+)/);
    osVersion = m?.[1] ?? '';
  } else if (/iphone os|cpu os/.test(s)) {
    osName = 'iOS';
    const m = s.match(/(?:iphone os|cpu os) ([\d_]+)/);
    osVersion = m?.[1]?.replace(/_/g, '.') ?? '';
  } else if (/linux/.test(s)) {
    osName = 'Linux';
  }

  // Browser
  let browserName = 'Unknown';
  let browserVersion = '';

  if (/edg\//.test(s)) {
    browserName = 'Edge';
    const m = ua.match(/Edg\/([\d.]+)/i);
    browserVersion = m?.[1] ?? '';
  } else if (/opr\/|opera/.test(s)) {
    browserName = 'Opera';
    const m = ua.match(/(?:OPR|Opera)\/([\d.]+)/i);
    browserVersion = m?.[1] ?? '';
  } else if (/chrome/.test(s) && !/chromium/.test(s)) {
    browserName = 'Chrome';
    const m = ua.match(/Chrome\/([\d.]+)/i);
    browserVersion = m?.[1] ?? '';
  } else if (/safari/.test(s) && !/chrome/.test(s)) {
    browserName = 'Safari';
    const m = ua.match(/Version\/([\d.]+)/i);
    browserVersion = m?.[1] ?? '';
  } else if (/firefox/.test(s)) {
    browserName = 'Firefox';
    const m = ua.match(/Firefox\/([\d.]+)/i);
    browserVersion = m?.[1] ?? '';
  } else if (/msie|trident/.test(s)) {
    browserName = 'Internet Explorer';
    const m = ua.match(/(?:MSIE |rv:)([\d.]+)/i);
    browserVersion = m?.[1] ?? '';
  }

  return { browserName, browserVersion, osName, osVersion, deviceType };
}

function getClientIp(req: Request): string | null {
  // Vercel / proxies put the real IP here
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? null;
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
    const deviceId: string | undefined = body.deviceId;
    const pagePath: string | undefined = body.pagePath;
    const referrer: string | undefined = body.referrer;

    if (!messages.length) {
      return Response.json({ error: 'No messages provided' }, { status: 400 });
    }

    const provider = getProvider(config.providerMode);
    const modelId = getModelId(config.providerMode);

    // The last user message is the new one we received this turn.
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const userText = lastUserMessage ? extractText(lastUserMessage) : '';

    // ── Session management ────────────────────────────────────────────────────
    let chatSessionId = sessionId;

    if (chatSessionId) {
      const existing = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        select: { id: true },
      });
      if (!existing) chatSessionId = undefined;
    }

    if (!chatSessionId) {
      const ua = req.headers.get('user-agent') ?? '';
      const uaInfo = ua ? parseUA(ua) : null;
      const ipAddress = getClientIp(req);

      // Vercel injects geo headers automatically in production
      const country = req.headers.get('x-vercel-ip-country') ?? undefined;
      const region = req.headers.get('x-vercel-ip-country-region') ?? undefined;
      const city = req.headers.get('x-vercel-ip-city')
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ? decodeURIComponent(req.headers.get('x-vercel-ip-city')!)
        : undefined;

      const session = await prisma.chatSession.create({
        data: {
          visitorId: deviceId ?? null,
          pagePath,
          referrer: referrer ?? null,
          provider: config.providerMode,
          model: modelId,
          userAgent: ua || undefined,
          ipAddress: ipAddress ?? undefined,
          country,
          region,
          city,
          browserName: uaInfo?.browserName,
          browserVersion: uaInfo?.browserVersion,
          osName: uaInfo?.osName,
          osVersion: uaInfo?.osVersion,
          deviceType: uaInfo?.deviceType,
        },
      });
      chatSessionId = session.id;
    } else if (deviceId) {
      await prisma.chatSession.updateMany({
        where: { id: chatSessionId, visitorId: null },
        data: { visitorId: deviceId },
      });
    }

    // Save the new user message (only this turn's message — not the whole history)
    if (userText && chatSessionId) {
      await prisma.chatMessage.create({
        data: {
          sessionId: chatSessionId,
          role: 'user',
          content: userText,
        },
      });
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
            "i'm only here to talk about moaaz",
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

    // Always echo the session ID back so the client can persist it
    if (chatSessionId) {
      response.headers.set('x-chat-session-id', chatSessionId);
    }

    return response;
  } catch (error) {
    toast.error(`Failed to generate response. Please try again.${error instanceof Error ? ` (${error.message})` : ''}`);
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 },
    );
  }
}

