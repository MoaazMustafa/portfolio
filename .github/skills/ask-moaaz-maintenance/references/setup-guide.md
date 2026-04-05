# Ask Moaaz — AI Twin Setup Guide

A free-to-run AI assistant that answers visitor questions about Moaaz on the portfolio site.

## Prerequisites

- Node.js 20+
- PostgreSQL database (Neon, Supabase, Railway, or local)
- The portfolio project cloned and dependencies installed

## 1. Install Dependencies

All required packages are already in `package.json`. If starting fresh:

```bash
npm install
```

Key AI packages: `ai`, `@ai-sdk/openai`, `@assistant-ui/react`, `@assistant-ui/react-ai-sdk`.

## 2. Environment Variables

Add these to your `.env` (or `.env.local`):

```env
# ── Ask Moaaz AI Provider ──

# Option A: Hosted free provider (recommended to start)
AI_API_KEY=your_api_key_here
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=meta-llama/llama-3.1-8b-instruct:free

# Option B: Local provider (Ollama)
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2
```

You only need **one** of the two options. The dashboard toggle in `/dashboard/assistant` switches between `hosted` and `local` mode at runtime.

## 3. Free Hosted Setup (OpenRouter)

1. Sign up at [openrouter.ai](https://openrouter.ai) — free account includes starter credits
2. Create an API key at [openrouter.ai/keys](https://openrouter.ai/keys)
3. Set `AI_API_KEY` to your key
4. Set `AI_BASE_URL` to `https://openrouter.ai/api/v1`
5. Set `AI_MODEL` to a free model, e.g.:
   - `meta-llama/llama-3.1-8b-instruct:free` (good balance)
   - `google/gemma-2-9b-it:free`
   - Browse free models at [openrouter.ai/models?q=free](https://openrouter.ai/models?q=free)

### Alternative: Groq (Free Tier)

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key
3. Set `AI_BASE_URL` to `https://api.groq.com/openai/v1`
4. Set `AI_MODEL` to e.g. `llama-3.1-8b-instant`

## 4. Free Local Setup (Ollama)

1. Install Ollama: [ollama.ai/download](https://ollama.ai/download)
2. Pull a model:
   ```bash
   ollama pull llama3.2
   ```
3. Start Ollama (it runs on port 11434 by default):
   ```bash
   ollama serve
   ```
4. Set env vars:
   ```env
   OLLAMA_BASE_URL=http://localhost:11434/v1
   OLLAMA_MODEL=llama3.2
   ```
5. In the dashboard (`/dashboard/assistant`), set Provider Mode to **Local (Ollama)**

## 5. Database Setup

The assistant uses four new database tables. Push the schema:

```bash
npx prisma db push
```

Tables created:

- `assistant_config` — global assistant settings (enabled toggle, name, prompts)
- `assistant_knowledge` — curated knowledge entries (bio, skills, FAQ, etc.)
- `chat_sessions` — visitor conversation metadata
- `chat_messages` — individual messages with refusal tracking

## 6. Dashboard Management

### Assistant Settings (`/dashboard/assistant`)

- **Enable/Disable Toggle** — turns the floating widget on/off across the public site
- **Display Name** — shown in the chat header
- **Greeting** — first message visitors see
- **Refusal Message** — guides off-topic refusals in the system prompt
- **System Prompt Override** — replaces the default prompt entirely (use `{KNOWLEDGE_BLOCK}` to inject knowledge)
- **Suggested Prompts** — one per line, shown as quick-start buttons
- **Provider Mode** — switch between hosted and local at runtime

### Knowledge Base (`/dashboard/assistant`)

- Add, edit, delete knowledge entries
- Categories: `bio`, `skills`, `projects`, `experience`, `faq`, `custom`
- Priority controls context ordering (higher = first)
- Disable entries without deleting

### Chat History (`/dashboard/assistant/chats`)

- View all visitor conversations with timestamps and metadata
- Stat cards: total sessions, messages, refusals, recent activity
- Expand sessions to read full transcripts
- Delete sessions you no longer need
- Refusal badge highlights off-topic attempts

## 7. How the Behavior Loop Works

1. Visitors chat with Ask Moaaz on the public site
2. All messages are stored in the database with refusal detection
3. Review transcripts in `/dashboard/assistant/chats`
4. Identify recurring questions → add knowledge entries
5. Identify poor refusals → refine the refusal message or system prompt
6. Test changes via the floating widget

The assistant does **not** self-modify. All improvements go through your manual review in the dashboard.

## 8. Privacy Note

Visitor chats are stored in your database for analytics. Consider adding a brief disclosure near the chat widget, e.g., "Chats may be stored to improve the assistant." No personally identifiable information is collected beyond what visitors type.

## 9. Architecture Overview

```
Visitor browser
  ├── /api/assistant/config  →  Public state (enabled, greeting, prompts)
  ├── /api/chat              →  Streaming chat (Vercel AI SDK)
  │     ├── Loads AssistantConfig from DB
  │     ├── Builds system prompt with knowledge block
  │     ├── Routes to hosted or local provider
  │     └── Persists session + messages to DB
  └── Floating widget (assistant-ui AssistantModal)
        └── Reads config, sends messages, renders streaming response

Dashboard (/dashboard/assistant)
  ├── Config form (enable toggle, prompts, provider mode)
  ├── Knowledge CRUD (categories, priority, content)
  └── /chats — analytics and transcript review
```

## 10. Verification Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] Floating widget appears on public pages when enabled
- [ ] Floating widget hides when disabled in dashboard
- [ ] "Who is Moaaz?" returns a grounded answer
- [ ] "Explain quantum physics" gets a polite refusal
- [ ] Chat sessions appear in `/dashboard/assistant/chats`
- [ ] Refusals are tagged in the transcript view
- [ ] Provider switching works (hosted ↔ local)
- [ ] Navbar bot icon opens the chat modal

## Troubleshooting

| Problem                                 | Fix                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| Widget doesn't appear                   | Check `/api/assistant/config` returns `enabled: true`. Check console for errors. |
| "Failed to generate response"           | Verify `AI_API_KEY` and `AI_BASE_URL` are set. Check the provider is reachable.  |
| Ollama not connecting                   | Ensure `ollama serve` is running. Check `OLLAMA_BASE_URL` env var.               |
| No messages in chat history             | The API route persists messages — check database connection and Prisma logs.     |
| Dashboard shows "Admin access required" | Sign in with an account that has `ADMIN` role in the `users` table.              |
