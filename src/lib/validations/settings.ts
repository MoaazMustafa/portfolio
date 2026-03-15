import * as z from 'zod';

export const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().max(120, 'Title must be at most 120 characters').optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal('')),
  githubUrl: z
    .string()
    .url('GitHub URL must be valid')
    .optional()
    .or(z.literal('')),
  linkedinUrl: z
    .string()
    .url('LinkedIn URL must be valid')
    .optional()
    .or(z.literal('')),
  websiteUrl: z
    .string()
    .url('Website URL must be valid')
    .optional()
    .or(z.literal('')),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
