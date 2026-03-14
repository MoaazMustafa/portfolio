'use server'

import { randomBytes } from "crypto"

import type { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { prisma } from "@/lib/prisma"


export async function createInvitation(email: string, role: string = 'USER') {
    if (!email) return { error: "Email is required" }

    // Generate random token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    try {
        await prisma.invitation.create({
            data: {
                email,
                token,
                expires,
                role: role as UserRole,
            },
        })

        revalidatePath("/dashboard/users")
        // Return full URL
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        return { success: true, url: `${baseUrl}/invite/${token}` }
    } catch {
        // console.error(error)
        return { error: "Failed to create invitation" }
    }
}

export async function getInvitation(token: string) {
    const invitation = await prisma.invitation.findUnique({
        where: { token },
    })

    if (!invitation || new Date(invitation.expires) < new Date()) {
        return { error: "Invalid or expired token", invitation: null }
    }

    return { invitation, error: null }
}

const onboardingSchema = z.object({
    name: z.string().min(2, "Name is required"),
    title: z.string().optional(),
    bio: z.string().optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    image: z.string().optional().nullable(),
})

export type OnboardingData = z.infer<typeof onboardingSchema>

export async function submitOnboarding(token: string, data: OnboardingData) {
    // 1. Validate token again
    const invitation = await prisma.invitation.findUnique({
        where: { token },
    })

    if (!invitation || new Date(invitation.expires) < new Date()) {
        return { error: "Invalid or expired token" }
    }

    // 2. Validate data
    const validated = onboardingSchema.safeParse(data)
    if (!validated.success) {
        return { error: "Invalid data" }
    }

    try {
        // 3. Create User
        // Check if user already exists (maybe they signed up before invite?)
        const existingUser = await prisma.user.findUnique({
            where: { email: invitation.email },
        })

        if (existingUser) {
            // Update existing user
            await prisma.user.update({
                where: { email: invitation.email },
                data: {
                    ...validated.data,
                    role: invitation.role || 'USER', // Ensure role is set from invitation
                },
            })
        } else {
            // Create new user
            await prisma.user.create({
                data: {
                    email: invitation.email,
                    ...validated.data,
                    role: invitation.role || 'USER',
                    emailVerified: new Date(), // They possessed the token
                },
            })
        }

        // 4. Delete Invitation
        await prisma.invitation.delete({
            where: { token },
        })

        return { success: true }
    } catch {
        // console.error(error)
        return { error: "Failed to complete onboarding" }
    }
}
