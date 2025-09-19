import { adminAuth } from "./lib/auth-admin"
import { clientAuth } from "./lib/auth-client"
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

                    console.log(adminToken.laravelAccessToken)

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

	if (url.startsWith("/user")) {
		const clientSession = await clientAuth()
		const clientToken = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
			cookieName: "client.session-token"
		})

		if (url === "/user" || url === "/user/login") {
			if (clientToken?.laravelAccessToken) {
				try {
					const verify = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/auth/me`, {
						headers: { Authorization: `Bearer ${clientToken.laravelAccessToken}` }
					})

					if (verify.ok) {
						return NextResponse.redirect(new URL("/user/dashboard", req.url))
					}
				} catch (error) {
					console.error("Erreur vérification token user:", error)
				}
			}
			return NextResponse.next()
		}

		if (!clientSession || !clientToken?.laravelAccessToken) {
			return NextResponse.redirect(new URL("/user", req.url))
		}

		try {
			const verify = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/auth/me`, {
				headers: { Authorization: `Bearer ${clientToken.laravelAccessToken}` }
			})

			if (!verify.ok) {
				const redirectResponse = NextResponse.redirect(new URL("/user", req.url))
				redirectResponse.cookies.delete("client.session-token")
				return redirectResponse
			}
		} catch (error) {
			console.error("Erreur vérification token user:", error)
			const redirectResponse = NextResponse.redirect(new URL("/user", req.url))
			redirectResponse.cookies.delete("client.session-token")
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