import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map((email) => email.trim()) || [];
      
      // Allow if user is in the allowed emails list
      if (user.email && allowedEmails.includes(user.email)) {
        return true;
      }

      // Allow if user already exists in database
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (existingUser) return true

        // Allow if there is a valid invitation
        const invitation = await prisma.invitation.findFirst({
            where: { email: user.email },
        })
        if (invitation) return true
      }

      return false // Return false to display a default error message
    },
    async session({ session, user }) {
        if (session.user?.email) {
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
            })
            if (dbUser) {
                session.user.id = dbUser.id
                session.user.role = dbUser.role
            }
        }
        return session
    }
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  secret: process.env.NEXTAUTH_SECRET,
}
