"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
})

export type CreateUserData = z.infer<typeof createUserSchema>

export async function createUser(data: CreateUserData) {
  const result = createUserSchema.safeParse(data)

  if (!result.success) {
    return { error: "Invalid data" }
  }

  const { name, email, role } = result.data

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
  role: z.enum(["USER", "ADMIN"]),
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
    return { error: "Failed to update user" }
  }
}