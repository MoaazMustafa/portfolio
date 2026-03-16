"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { settingsSchema, type SettingsFormValues } from "@/lib/validations/settings"

const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
})

export type CreateUserData = z.input<typeof createUserSchema>

export async function createUser(data: CreateUserData) {
  const result = createUserSchema.safeParse(data)

  if (!result.success) {
    return { error: "Invalid data" }
  }

  const { name, email, role, title, bio, githubUrl, linkedinUrl, websiteUrl, image } = result.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    await prisma.user.create({
      data: {
        name,
        email,
        role,
        title,
        bio,
        githubUrl,
        linkedinUrl,
        websiteUrl,
        image,
        emailVerified: new Date(), // Manually created users are considered verified
      },
    })

    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { error: "Failed to create user" }
  }
}

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["USER", "ADMIN"]).optional(),
  image: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
})

export type UpdateUserData = z.infer<typeof updateUserSchema>

export async function updateUser(data: UpdateUserData) {
  const result = updateUserSchema.safeParse(data)

  if (!result.success) {
    return { error: "Invalid data" }
  }

  const { id, ...updateData } = result.data

  try {
    // Check if email is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: updateData.email,
        NOT: {
          id: id,
        },
      },
    })

    if (existingUser) {
      return { error: "Email is already in use by another user" }
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user:", error)
    if (error instanceof Error) {
        return { error: error.message }
    }
    return { error: "Failed to update user" }
  }
}

export async function updateCurrentUserSettings(data: SettingsFormValues) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { error: "You must be signed in to update settings" }
  }

  const result = settingsSchema.safeParse(data)

  if (!result.success) {
    return { error: "Invalid data" }
  }

  const payload = result.data

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return { error: "User not found" }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: payload.name,
        title: payload.title?.trim() ? payload.title : null,
        bio: payload.bio?.trim() ? payload.bio : null,
        image: payload.image?.trim() ? payload.image : null,
        githubUrl: payload.githubUrl?.trim() ? payload.githubUrl : null,
        linkedinUrl: payload.linkedinUrl?.trim() ? payload.linkedinUrl : null,
        websiteUrl: payload.websiteUrl?.trim() ? payload.websiteUrl : null,
      },
    })

    revalidatePath("/dashboard/settings")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update current user settings:", error)
    return { error: "Failed to update settings" }
  }
}