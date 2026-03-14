import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function proxy(req) {
    // console.log(req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null,
    },
  }
)

export const config = { matcher: ["/dashboard/:path*"] }