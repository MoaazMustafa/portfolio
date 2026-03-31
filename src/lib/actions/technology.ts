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
    revalidatePath("/")
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
    revalidatePath("/")
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
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Delete technology error:", error)
    return { error: "Failed to delete technology" }
  }
}

// Seeding function
export async function seedTechnologies() {
    const categories: Record<string, { name: string; icon: string }[]> = {
        Frontend: [
            { name: "React", icon: "logos:react" },
            { name: "Next.js", icon: "logos:nextjs-icon" },
            { name: "TypeScript", icon: "logos:typescript-icon" },
            { name: "JavaScript", icon: "logos:javascript" },
            { name: "HTML5", icon: "logos:html-5" },
            { name: "CSS3", icon: "logos:css-3" },
            { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
            { name: "Bootstrap", icon: "logos:bootstrap" },
            { name: "Framer Motion", icon: "logos:framer" },
            { name: "Shadcn/ui", icon: "simple-icons:shadcnui" },
            { name: "Material UI", icon: "logos:material-ui" },
            { name: "Ant Design", icon: "logos:ant-design" },
            { name: "GSAP", icon: "logos:greensock" },
            { name: "Node Package Manager", icon: "logos:npm-icon" },
            { name: "ThreeJS", icon: "logos:threejs" },
            { name: "Redux", icon: "logos:redux" },
        ],
        Backend: [
            { name: "Node.js", icon: "logos:nodejs-icon" },
            { name: "Express.js", icon: "logos:express" },
            { name: "Prisma", icon: "logos:prisma" },
            { name: "GraphQL", icon: "logos:graphql" },
            { name: "REST API", icon: "mdi:api" },
            { name: "WebSockets", icon: "logos:websocket" },
            { name: "OpenAI", icon: "logos:openai" },
            { name: "Socket.io", icon: "logos:socket-io" },
            { name: "NestJS", icon: "logos:nestjs" },
            { name: "Python", icon: "logos:python" },
            { name: "Django", icon: "logos:django-icon" },
            { name: "FastAPI", icon: "logos:fastapi-icon" },
        ],
        Database: [
            { name: "PostgreSQL", icon: "logos:postgresql" },
            { name: "MongoDB", icon: "logos:mongodb-icon" },
            { name: "MySQL", icon: "logos:mysql" },
            { name: "Supabase", icon: "logos:supabase-icon" },
            { name: "Redis", icon: "logos:redis" },
            { name: "Firebase", icon: "logos:firebase" },
        ],
        Mobile: [
            { name: "React Native", icon: "logos:react" },
            { name: "Flutter", icon: "logos:flutter" },
            { name: "Expo", icon: "logos:expo" },
        ],
        "DevOps & Tools": [
            { name: "Git", icon: "logos:git-icon" },
            { name: "GitHub", icon: "logos:github-icon" },
            { name: "Docker", icon: "logos:docker-icon" },
            { name: "Vercel", icon: "logos:vercel-icon" },
            { name: "AWS", icon: "logos:aws" },
            { name: "Cloudinary", icon: "logos:cloudinary-icon" },
            { name: "Figma", icon: "logos:figma" },
            { name: "VS Code", icon: "logos:visual-studio-code" },
            { name: "Visual Studio", icon: "logos:visual-studio" },
            { name: "Postman", icon: "logos:postman-icon" },
            { name: "Adobe XD", icon: "logos:adobe-xd" },
            { name: "Adobe Photoshop", icon: "logos:adobe-photoshop" },
            { name: "MacOS", icon: "catppuccin:macos" },
            { name: "Windows", icon: "devicon:windows11" },
            { name: "Linux", icon: "logos:linux-tux" },
            { name: "Jira", icon: "logos:jira" },
            { name: "Clickup", icon: "simple-icons:clickup" },
            { name: "Discord", icon: "logos:discord-icon" },
            { name: "Slack", icon: "logos:slack-icon" },
            { name: "Google Chrome", icon: "devicon:chrome" },
            { name: "Safari Browser", icon: "devicon:safari" },
            { name: "Canva", icon: "devicon:canva" },
            { name: "GitHub Actions", icon: "logos:github-actions" },
            { name: "Kubernetes", icon: "logos:kubernetes" },
            { name: "Antigravity", icon: "material-symbols:antigravity-outline" },
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
    revalidatePath("/")
    return { success: true, count }
}

export async function getPublicTechnologies() {
  return prisma.technology.findMany({
    select: { id: true, name: true, slug: true, category: true, icon: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
}
