import NextAuth from "next-auth"
import { adminAuthConfig } from "@/lib/auth-admin.config"

const handler = NextAuth(adminAuthConfig)

export { handler as GET, handler as POST }
