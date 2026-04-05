---
name: ask-moaaz-maintenance
description: 'Maintain the Ask Moaaz AI twin assistant — update knowledge base entries, review chat analytics, adjust system prompts and guardrails, manage the enable/disable toggle, and troubleshoot provider configuration. Use when: updating assistant biography, adding FAQ entries, reviewing off-topic refusals, changing the system prompt, switching providers, or debugging chat persistence.'
argument-hint: 'Describe what you want to update or review about the Ask Moaaz assistant'
---

# Ask Moaaz AI Twin Maintenance

## When to Use

- Adding or editing knowledge base entries (biography, skills, projects, FAQ)
- Reviewing stored chat sessions for recurring questions or failed refusals
- Updating the system prompt or refusal wording
- Switching between hosted (OpenRouter/Groq) and local (Ollama) providers
- Enabling or disabling Ask Moaaz from the dashboard
- Troubleshooting streaming, persistence, or provider errors

## Architecture Overview

The Ask Moaaz assistant has three layers:

1. **Knowledge layer** — file-based defaults in `src/lib/assistant/knowledge.ts` and database-managed entries in the `assistant_knowledge` table. DB entries take priority when present.
2. **Runtime layer** — a streaming chat API at `src/app/api/chat/route.ts` using Vercel AI SDK, loading config from `assistant_config` and knowledge from the DB/file fallback.
3. **UI layer** — a floating assistant-ui modal widget in `src/components/ask-moaaz-widget.tsx`, mounted in `src/app/(public)/layout.tsx`, reading enable state from `/api/assistant/config`.

## Key Files

| File                                                  | Purpose                                                                       |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Knowledge defaults](./references/knowledge-files.md) | `src/lib/assistant/knowledge.ts` — fallback biography, skills, experience     |
| `src/lib/assistant/config.ts`                         | Loads config from DB, builds system prompt with knowledge block               |
| `src/app/api/chat/route.ts`                           | Streaming chat endpoint, persists sessions and messages                       |
| `src/app/api/assistant/config/route.ts`               | Public config endpoint for the widget enabled state                           |
| `src/lib/actions/assistant.ts`                        | Server actions for CRUD on config, knowledge, and chat analytics              |
| `src/lib/validations/assistant.ts`                    | Zod schemas for config and knowledge forms                                    |
| `src/app/dashboard/assistant/page.tsx`                | Dashboard settings and knowledge management                                   |
| `src/app/dashboard/assistant/chats/page.tsx`          | Chat analytics and transcript review                                          |
| `prisma/schema.prisma`                                | Models: `AssistantConfig`, `AssistantKnowledge`, `ChatSession`, `ChatMessage` |

## Procedures

### Update Knowledge Base

1. Open the dashboard at `/dashboard/assistant`
2. In the Knowledge Base section, click **Add Entry**
3. Choose a category (`bio`, `skills`, `projects`, `experience`, `faq`, `custom`)
4. Set priority (higher = included first in the model context)
5. Save — the assistant will use updated knowledge on next request

Or edit `src/lib/assistant/knowledge.ts` for defaults that apply when no DB entries exist.

### Review Chat Analytics

1. Go to `/dashboard/assistant/chats`
2. Review summary stats: total sessions, messages, refusals, recent activity
3. Expand individual sessions to read transcripts
4. Identify recurring unanswered questions — consider adding knowledge entries
5. Delete sessions that are no longer useful

### Update System Prompt

1. In `/dashboard/assistant`, edit the **System Prompt Override** field
2. Use `{KNOWLEDGE_BLOCK}` placeholder where knowledge entries should be injected
3. Leave blank to use the default prompt from `src/lib/assistant/knowledge.ts`

### Switch Provider

1. In the dashboard, change **Provider Mode** between `hosted` and `local`
2. Ensure environment variables are set:
   - Hosted: `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`
   - Local: `OLLAMA_BASE_URL`, `OLLAMA_MODEL`

### Enable/Disable Ask Moaaz

1. Toggle **Enable Ask Moaaz** in `/dashboard/assistant`
2. When disabled: the floating widget hides, the API returns 503, and the navbar button hides

## Environment Variables

See [setup guide](./references/setup-guide.md) for full details.

```env
# Hosted provider (OpenRouter / Groq)
AI_API_KEY=
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=meta-llama/llama-3.1-8b-instruct:free

# Local provider (Ollama)
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2
```
