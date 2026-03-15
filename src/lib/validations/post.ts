import * as z from 'zod';

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must only contain lowercase letters, numbers, and hyphens',
    ),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  published: z.boolean(),
});

export type PostFormValues = z.infer<typeof postSchema>;
