/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { randomBytes } from "crypto"

import { revalidatePath } from "next/cache"
import { toast } from "sonner"

import { prisma } from "@/lib/prisma"

export async function createInvitation(email: string) {
    if (!email) return { error: "Email is required" }

    try {
        const token = randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        const invitation = await (prisma as any).invitation.create({
            data: {
                email,
                token,
                expires,
            },
        })

        revalidatePath("/dashboard/users")
        return { success: true, token: invitation.token }
    } catch (error) {
        toast.error(`Failed to create invitation: ${error}`)
        return { error: "Failed to create invitation" }
    }
}

export async function verifyToken(token: string) {
    const invitation = await (prisma as any).invitation.findUnique({
        where: { token },
    })

    if (!invitation || invitation.expires < new Date()) {
        return null
    }

    return invitation
}

export async function completeInvitation(token: string, userData: any) {
    const invitation = await (prisma as any).invitation.findUnique({
        where: { token },
    })

    if (!invitation || invitation.expires < new Date()) {
        return { error: "Invalid or expired token" }
    }

    try {
        // Create or update user
        const existingUser = await (prisma as any).user.findUnique({
            where: { email: invitation.email },
        })

        let user
        if (existingUser) {
            user = await (prisma as any).user.update({
                where: { id: existingUser.id },
                data: {
                    name: userData.name,
                    title: userData.title,
                    bio: userData.bio,
                    image: userData.image,
                    githubUrl: userData.githubUrl,
                    linkedinUrl: userData.linkedinUrl,
                    websiteUrl: userData.websiteUrl,
                    // If user was created by Auth provider, we don't overwrite emailVerified usually, 
                    // but for manual creation we might consider them verified or partially verified.
                    // For now, let's assume they verify by clicking the link if we count this as auth.
                },
            })
        } else {
             user = await (prisma as any).user.create({
                data: {
                    email: invitation.email,
                    name: userData.name,
                    title: userData.title,
                    bio: userData.bio,
                    image: userData.image,
                    githubUrl: userData.githubUrl,
                    linkedinUrl: userData.linkedinUrl,
                    websiteUrl: userData.websiteUrl,
                    role: invitation.role, // Use role from invite
                },
            })
        }

        // Delete invitation
        await (prisma as any).invitation.delete({
            where: { id: invitation.id },
        })

        return { success: true, user }
    } catch (error) {
        toast.error(`Failed to create user: ${error}`)
        return { error: "Failed to create user" }
    }
}
