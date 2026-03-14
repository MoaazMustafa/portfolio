"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const technologySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").optional(), // Can generate
  category: z.string().min(1, "Category is required").default("Other"),
  icon: z.string().optional().nullable(),
})

export type TechnologyData = z.infer<typeof technologySchema>

export async function createTechnology(data: TechnologyData) {
  try {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    await prisma.technology.create({
      data: {
        name: data.name,
        slug,
        category: data.category,
        icon: data.icon,
      },
    })
    revalidatePath("/dashboard/technologies")
    return { success: true }
  } catch (error) {
    console.error("Create technology error:", error)
    return { error: "Failed to create technology" }
  }
}

export async function updateTechnology(data: TechnologyData) {
  if (!data.id) return { error: "ID is required for update" }
  try {
     const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
     
    await prisma.technology.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug,
        category: data.category,
        icon: data.icon,
      },
    })
    revalidatePath("/dashboard/technologies")
    return { success: true }
  } catch (error) {
    console.error("Update technology error:", error)
    return { error: "Failed to update technology" }
  }
}

export async function deleteTechnology(id: string) {
  try {
    await prisma.technology.delete({
      where: { id },
    })
    revalidatePath("/dashboard/technologies")
    return { success: true }
  } catch (error) {
    console.error("Delete technology error:", error)
    return { error: "Failed to delete technology" }
  }
}

// Seeding function
export async function seedTechnologies() {
    const categories = {
        Frontend: [
            { name: "React", icon: "logos:react" },
            { name: "Next.js", icon: "logos:nextjs-icon" },
            { name: "TypeScript", icon: "logos:typescript-icon" },
            { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
            { name: "HTML5", icon: "logos:html-5" },
            { name: "CSS3", icon: "logos:css-3" },
            { name: "JavaScript", icon: "logos:javascript" },
            { name: "Framer Motion", icon: "simple-icons:framermotion" },
            { name: "Redux", icon: "logos:redux" },
        ],
        Backend: [
            { name: "Node.js", icon: "logos:nodejs-icon" },
            { name: "Express", icon: "logos:express" },
            { name: "NestJS", icon: "logos:nestjs" },
            { name: "Python", icon: "logos:python" },
            { name: "Django", icon: "logos:django-icon" },
            { name: "FastAPI", icon: "logos:fastapi-icon" },
            { name: "Prisma", icon: "simple-icons:prisma" },
            { name: "GraphQL", icon: "logos:graphql" },
        ],
        Database: [
            { name: "PostgreSQL", icon: "logos:postgresql" },
            { name: "MongoDB", icon: "logos:mongodb-icon" },
            { name: "MySQL", icon: "logos:mysql" },
            { name: "Redis", icon: "logos:redis" },
            { name: "Supabase", icon: "logos:supabase-icon" },
        ],
        DevOps: [
            { name: "Docker", icon: "logos:docker-icon" },
            { name: "Kubernetes", icon: "logos:kubernetes" },
            { name: "AWS", icon: "logos:aws" },
            { name: "Vercel", icon: "logos:vercel-icon" },
            { name: "GitHub Actions", icon: "logos:github-actions" },
            { name: "Linux", icon: "logos:linux-tux" },
        ],
        Tools: [
             { name: "Git", icon: "logos:git-icon" },
             { name: "VS Code", icon: "logos:visual-studio-code" },
             { name: "Figma", icon: "logos:figma" },
             { name: "Postman", icon: "logos:postman-icon" },
        ],
        "AI/ML": [
            { name: "TensorFlow", icon: "logos:tensorflow" },
            { name: "PyTorch", icon: "logos:pytorch-icon" },
            { name: "OpenAI API", icon: "simple-icons:openai" },
        ]
    }

    let count = 0;
    for (const [category, techs] of Object.entries(categories)) {
        for (const tech of techs) {
            const slug = tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            try {
                await prisma.technology.upsert({
                    where: { slug },
                    update: { category, icon: tech.icon },
                    create: {
                        name: tech.name,
                        slug,
                        category,
                        icon: tech.icon,
                    }
                })
                count++;
            } catch (e) {
                console.error(`Failed to seed ${tech.name}`, e)
            }
        }
    }
    
    revalidatePath("/dashboard/technologies")
    return { success: true, count }
}
