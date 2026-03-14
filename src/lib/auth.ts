import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email === "contactwithmoaaz@gmail.com") {
        return true
      }
      return false // Return false to display a default error message
    },
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  secret: process.env.NEXTAUTH_SECRET,
}
