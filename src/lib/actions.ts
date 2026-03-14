"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectFormValues } from "@/lib/validations/project";


export async function createProject(data: ProjectFormValues) {
  try {
    const validatedData = projectSchema.parse(data)

    await (prisma as any).project.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        content: validatedData.content,
        // Optional URLs
        coverImage: validatedData.coverImage || null,
        liveUrl: validatedData.liveUrl || null,
        githubUrl: validatedData.githubUrl || null,
        images: validatedData.images.map((img) => img.value) || [],
        
        // Date handling
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,

        // Booleans
        isFeatured: validatedData.isFeatured,
        isVisible: validatedData.isVisible,
        status: validatedData.status,

        // Relations: Connect by IDs if provided
        technologies: {
          connect: validatedData.technologies?.map((id) => ({ id })) || [],
        },
        categories: {
          connect: validatedData.categories?.map((id) => ({ id })) || [],
        },
        collaborators: {
          connect: validatedData.collaborators?.map((id) => ({ id })) || [],
        },
      },
    })

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues }
    }
    return { error: "Something went wrong" }
  }
}

export async function updateProject(id: string, data: ProjectFormValues) {
    try {
        const validatedData = projectSchema.parse(data)

        await (prisma as any).project.update({
            where: { id },
            data: {
                title: validatedData.title,
                slug: validatedData.slug,
                description: validatedData.description,
                content: validatedData.content,
                coverImage: validatedData.coverImage || null,
                liveUrl: validatedData.liveUrl || null,
                githubUrl: validatedData.githubUrl || null,
                images: validatedData.images.map((img) => img.value) || [],
                startDate: new Date(validatedData.startDate),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
                isFeatured: validatedData.isFeatured,
                isVisible: validatedData.isVisible,
                status: validatedData.status,
                // Simple disconnect all/reconnect strategy for many-to-many update
                technologies: {
                    set: validatedData.technologies?.map((id) => ({ id })) || [],
                },
                categories: {
                    set: validatedData.categories?.map((id) => ({ id })) || [],
                },
                collaborators: {
                    set: validatedData.collaborators?.map((id) => ({ id })) || [],
                },
            },
        })

        revalidatePath("/dashboard/projects")
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues }
        }
        return { error: "Something went wrong" }
    }
}

export async function deleteProject(id: string) {
    try {
        await (prisma as any).project.delete({
            where: { id },
        })
        revalidatePath("/dashboard/projects")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete project" }
    }
}
