import { clientAuth } from "@/lib/auth-client"

const handler = clientAuth.handlers
export { handler as GET, handler as POST }