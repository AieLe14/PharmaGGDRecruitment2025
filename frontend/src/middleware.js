import { adminAuth } from "./lib/auth-admin"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export default async function middleware(req) {
	const url = req.nextUrl.pathname

	const allowedPrefixes = [
		"/api/",
		"/_next/",
		"/favicon.ico",
		"/robots.txt"
	]

	if (allowedPrefixes.some((prefix) => url.startsWith(prefix))) {
		return NextResponse.next()
	}

	if (url.startsWith("/admin")) {
		const adminSession = await adminAuth()
		const adminToken = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
			cookieName: "admin.session-token"
		})

		if (url === "/admin" || url === "/admin/login") {
			if (adminToken?.laravelAccessToken) {
				try {
					const verify = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/admin/auth/me`, {
						headers: { Authorization: `Bearer ${adminToken.laravelAccessToken}` }
					})


					if (verify.ok) {
						return NextResponse.redirect(new URL("/admin/dashboard", req.url))
					}
				} catch (error) {
					console.error("Erreur vérification token admin:", error)
				}
			}
			return NextResponse.next()
		}

		if (!adminSession || !adminToken?.laravelAccessToken) {
			return NextResponse.redirect(new URL("/admin", req.url))
		}

		try {
			const verify = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/admin/auth/me`, {
				headers: { Authorization: `Bearer ${adminToken.laravelAccessToken}` }
			})

			if (!verify.ok) {
				const redirectResponse = NextResponse.redirect(new URL("/admin", req.url))
				redirectResponse.cookies.delete("admin.session-token")
				return redirectResponse
			}
		} catch (error) {
			console.error("Erreur vérification token admin:", error)
			const redirectResponse = NextResponse.redirect(new URL("/admin", req.url))
			redirectResponse.cookies.delete("admin.session-token")
			return redirectResponse
		}

		return NextResponse.next()
	}


	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}