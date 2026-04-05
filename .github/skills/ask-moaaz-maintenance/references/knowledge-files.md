# Knowledge Files Reference

The Ask Moaaz assistant draws its knowledge from two sources:

## 1. Database Entries (Primary)

Managed via the dashboard at `/dashboard/assistant` in the **Knowledge Base** section.

- Stored in the `assistant_knowledge` table
- Fields: `category`, `title`, `content`, `priority`, `enabled`
- Categories: `bio`, `skills`, `projects`, `experience`, `faq`, `custom`
- Higher priority entries appear first in the model context
- Disabled entries are excluded without deletion

## 2. File-Based Defaults (Fallback)

Located at `src/lib/assistant/knowledge.ts`.

- Used only when no database entries exist (bootstrap / fresh installs)
- Contains default biography, tech stack, career timeline, work roles, portfolio project info, contact details, and current activities
- Also defines `defaultSystemPrompt` with the `{KNOWLEDGE_BLOCK}` placeholder

## How Knowledge Is Assembled

The `getAssistantConfig()` function in `src/lib/assistant/config.ts`:

1. Loads the `AssistantConfig` record from the database
2. Queries all enabled `AssistantKnowledge` entries, sorted by priority descending
3. Falls back to `defaultKnowledge` if no DB entries exist
4. Formats entries as `## Title [category]\nContent` blocks
5. Replaces `{KNOWLEDGE_BLOCK}` in the system prompt with the assembled block

## Guidelines for Editing Knowledge

- Keep entries focused: one topic per entry
- Use `priority` to control what the model sees first (context window is limited)
- Disable entries instead of deleting to preserve history
- After editing, test with the floating widget to verify the assistant uses updated facts
