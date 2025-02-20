import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { redirect } from "next/navigation"
import { defaultRoute } from "./routes";
 
const { auth } = NextAuth(authConfig)
// const router = useRouter();

export default auth((req: any) => {
    const isLoggedIn = !!req.auth;
})

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }