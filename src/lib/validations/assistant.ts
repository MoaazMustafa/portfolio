import * as z from 'zod';

export const assistantConfigSchema = z.object({
  enabled: z.boolean(),
  name: z.string().min(1, 'Name is required').max(50),
  greeting: z.string().min(1, 'Greeting is required').max(1000),
  systemPrompt: z.string().max(10000).optional().or(z.literal('')),
  refusalMessage: z.string().min(1, 'Refusal message is required').max(1000),
  suggestedPrompts: z.array(z.string().max(200)).max(10),
  providerMode: z.enum(['hosted', 'local']),
});

export type AssistantConfigFormValues = z.infer<typeof assistantConfigSchema>;

export const assistantKnowledgeSchema = z.object({
  category: z.enum(['bio', 'skills', 'projects', 'experience', 'faq', 'custom']),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required').max(10000),
  priority: z.number().int().min(0).max(1000),
  enabled: z.boolean(),
});

export type AssistantKnowledgeFormValues = z.infer<typeof assistantKnowledgeSchema>;
