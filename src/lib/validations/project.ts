import * as z from "zod"

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  coverImage: z.string().optional().or(z.literal("")),
  images: z.array(z.object({ value: z.string() })),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date string",
  }), // Input type="date" returns string
  endDate: z.string().optional().or(z.literal("")), // Can be empty if ongoing
  isFeatured: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  status: z.enum(["Planned", "Under_Development", "Completed", "On_Hold", "Cancelled"]),
  technologies: z.array(z.string()), // Array of IDs
  categories: z.array(z.string()), // Array of IDs
  collaborators: z.array(z.string()).optional(), // Array of IDs
})

export type ProjectFormValues = z.infer<typeof projectSchema>
